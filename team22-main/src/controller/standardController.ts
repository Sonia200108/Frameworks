import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';

class StandardController {
    
    public getIndexPage = async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).render('index', {});
        } catch (error) {
            res.status(500).json({ error: 'Failed to display page' });
        }
    }

    public getAdminPage = async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).render('admin', {});
        } catch (error) {
            res.status(500).json({ error: 'Failed to display page' });
        }
    }
}

export default new StandardController();