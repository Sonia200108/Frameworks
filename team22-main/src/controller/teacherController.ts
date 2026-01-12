import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Teacher } from '../entity/Teacher';
import { Class } from '../entity/Classroom';
import MainDAO from '../dao/MainDAO';

class TeacherController {
    private teacherRepository = AppDataSource.getRepository(Teacher);
    private classRepository = AppDataSource.getRepository(Class);

    public createTeacher = async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).render('addTeacher', {string: ""});
        } catch (error) {
            res.status(500).json({ error: 'Failed to display page' });
        }
    }

    public createTeacherForm = async (req: Request, res: Response): Promise<void> => {
        try {
            const { teacherName, teacherAge, classId } = req.body;
            const classExists = await MainDAO.getAllClasses();

            const duplicate = await this.teacherRepository.findOne(
                {where: {klass: { id: classId }},
            });
            if (!classExists){
                res.status(409).render('addTeacher', {string: "This class does not exist."});
            }
            else if (duplicate) {
                res.status(409).render('addTeacher', {string: "This class already has a teacher."});
            } else {
                const teacher = new Teacher();
                teacher.name = teacherName;
                teacher.age = teacherAge;
                teacher.klass = classId;
    
                await this.teacherRepository.save(teacher);
    
                res.status(201).render('addTeacher', {string: "Successfully added Teacher"});
            }
            
        } catch (error) {
            res.status(500).json({ error: 'Failed to create Teacher | ' + error });
        }
    }

    public getAllTeachers = async (req: Request, res: Response): Promise<void> => {
        try {
            const teachers = await this.teacherRepository.find({
                relations: {
                    klass: true
                }
            });
            
            res.render('teachers', { teachers });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Failed to fetch teachers' });
        }
    }


    public deleteTeacher = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            
            const result = await this.teacherRepository.delete(id);
    
            const teachers = await this.teacherRepository.find({
                relations: {
                    klass: true
                }
            });
            if (result.affected) { 
                res.status(200).render('teachers', { teachers, string: "Successfully deleted teacher" });
            } else {
                res.status(409).render('teachers', { teachers, string: "Could not delete teacher" });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Failed to delete family' });
        }
    }
    
}

export default new TeacherController();