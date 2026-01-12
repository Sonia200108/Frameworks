import { Request, Response } from 'express';
import MainDAO from '../dao/MainDAO';
import { Child } from '../entity/Child';

class ChildController {
    public getAllChildren = async (req: Request, res: Response): Promise<void> => {
        try {
            const children = await MainDAO.getAllChildren();
            res.status(200).render('children', { children });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Failed to fetch children' });
        }
    }

    public getChildById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const child = await MainDAO.getChildById(id);

            if (!child) {
                res.status(404).json({ error: 'Child not found' });
                return;
            }
            
            res.status(200).render('child', { child });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch child' + error });
        }
    }

    public createChild = async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).render('addChild', {string: ""});
        } catch (error) {
            res.status(500).json({ error: 'Failed to display page' });
        }
    }

    public createChildForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const { childName, childAge } = req.body;

            const child = new Child();
            child.name = childName;
            child.age = childAge;

            await MainDAO.createChild(child);

            res.status(201).render('addChild', {string: "Successfully added child"});
        } catch (error) {
            res.status(500).json({ error: 'Failed to create child' });
        }
    }
}

export default new ChildController();