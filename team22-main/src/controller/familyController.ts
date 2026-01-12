import { Request, Response } from 'express';
import MainDAO from '../dao/MainDAO';
import { Family } from '../entity/Family';
import { Parent } from '../entity/Parent';

class FamilyController {
    public createFamily = async (req: Request, res: Response): Promise<void> => {
        try {
            const parents = await MainDAO.getAllParents();
            res.status(200).render('addFamily', { parents });
        } catch (error) {
            res.status(500).json({ error: 'Failed to display page' });
        }
    };

    public createFamilyForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const {parent1, parent2 } = req.body;

            const family = new Family();
            family.parent1 = parent1;
            family.parent2 = parent2;

            await MainDAO.createFamily(family);
            
            const parents = await MainDAO.getAllParents();

            res.status(201).render('addFamily', {string: "Successfully added Family", parents});
        } catch (error) {
            res.status(500).json({ error: 'Failed to create Family | ' + error });
        }
    }

    public getAllFamilies = async (req: Request, res: Response): Promise<void> => {
        try {
            const families = await MainDAO.getAllFamilies();
            res.render('families', { families });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Failed to fetch families' });
        }
    }

    public addChild = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const children = await MainDAO.getChildById(id);
            const childrenList = await MainDAO.getAllChildren();
            console.log(children);
            res.status(200).render('addChildFamily', {children, childrenList, familyId: id});
        } catch (error) {
            res.status(500).json({ error: 'Failed to display page' });
        }
    }

    public addChildForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const { childId, familyId } = req.body;
    
            const child = await MainDAO.addChildToFamily(familyId, childId);
            const children = await MainDAO.getChildrenByFamilyId(familyId);
            const childrenList = await MainDAO.getAllChildren();
            console.log(children);
            if (child) {
                res.status(200).render('addChildFamily', { children, childrenList, familyId });
            } else {
                res.status(404).json({ error: 'Family or children not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to display page' + error });
        }
    };

    public deleteFamily = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const result = await MainDAO.deleteFamily(id);

            const families = await MainDAO.getAllFamilies();

            if (result.affected) { 
                res.status(200).render('families', { families, string: "Successfully deleted family" });
            } else {
                res.status(409).render('families', { families, string: "Could not delete family" });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Failed to delete family' });
        }
    }

    public getAllParents = async (req: Request, res: Response): Promise<void> => {
        try {
            const parents = await MainDAO.getAllParents();
            console.log(parents);
            res.render('parent', { parents });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Failed to fetch families' });
        }
    }
}

export default new FamilyController();