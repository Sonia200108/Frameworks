import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Class } from '../entity/Classroom';
import { mainModule } from 'process';
import MainDAO from '../dao/MainDAO';

class ClassController {
    private classRepository = AppDataSource.getRepository(Class);


    public getAllClasses = async (req: Request, res: Response): Promise<void> => {
        try {
            const classes = await MainDAO.getAllClasses();
            
            res.status(200).render('classes', { classes });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Failed to fetch classes' });
        }
    }

    public getClassById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const classroom = await MainDAO.getClassById(id);

            if (!classroom) {
                res.status(404).json({ error: 'Class not found' });
                return;
            }

            res.status(200).render('class', { classroom });

        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch class | ' + error});
        }
    }

    public createClass = async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).render('addClassroom', {string: ""});
        } catch (error) {
            res.status(500).json({ error: 'Failed to display page' });
        }
    }

    /*public createClassForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const { className, classYear } = req.body;

            const classRoom = new Class();
            classRoom.className = className;
            classRoom.year = classYear;

            await MainDAO.createClass(classRoom);

            res.status(201).render('addClassroom', {string: "Successfully added Classroom"});
        } catch (error) {
            res.status(500).json({ error: 'Failed to create Classroom' });
        }
    }*/

        public createClassForm = async (req: Request, res: Response): Promise<void> => {
            try {
                const { className, classYear } = req.body;
        
                if (!Array.isArray(className) || !Array.isArray(classYear)) {
                    res.status(400).json({ error: 'Invalid input format' });
                }
        
                const classRooms = className.map((name, index) => {
                    const classRoom = new Class();
                    classRoom.className = name;
                    classRoom.year = classYear[index];
                    return classRoom;
                });
        
                for (const classRoom of classRooms) {
                    await MainDAO.createClass(classRoom);
                }
        
                res.status(201).render('addClassroom', { string: "Successfully added Classrooms" });
            } catch (error) {
                res.status(500).json({ error: 'Failed to create Classrooms' });
            }
        };
        
}

export default new ClassController();