import { AppDataSource } from '../data-source';
import { Family } from '../entity/Family';
import { Parent } from '../entity/Parent';
import { Child } from '../entity/Child';
import { Class } from '../entity/Classroom';
import { Teacher } from '../entity/Teacher';

class MainDAO {
    private familyRepository = AppDataSource.getRepository(Family);
    private parentRepository = AppDataSource.getRepository(Parent);
    private childRepository = AppDataSource.getRepository(Child);
    private classRepository = AppDataSource.getRepository(Class);
    private teacherRepository = AppDataSource.getRepository(Teacher);

    // Child DAO methods
    public async getAllChildren(): Promise<Child[]> {
        return await this.childRepository.find({
            relations: {
                family: true
            }
        });
    }

    public async getChildById(id: number): Promise<Child | null> {
        return await this.childRepository.findOne({
            where: { id },
            relations: {
                family: {
                    parent1: true,
                    parent2: true,
                    children: true
                },
                klass: true
            }
        });
    }

    public async createChild(child: Child): Promise<Child> {
        return await this.childRepository.save(child);
    }

    // Family DAO methods
    public async getAllFamilies(): Promise<Family[]> {
        return await this.familyRepository.find({
            relations: {
                children: true,
                parent1: true,
                parent2: true
            }
        });
    }

    public async createFamily(family: Family): Promise<Family> {
        return await this.familyRepository.save(family);
    }

    public async deleteFamily(id: number): Promise<{ affected?: number }> {
        return await this.familyRepository.delete(id);
    }

    public async getAllParents(): Promise<Parent[]> {
        return await this.parentRepository.find({
            relations: {
                family: true
            }
        });
    }

    // Class DAO methods
    public async getAllClasses(): Promise<Class[]> {
        return await this.classRepository.find({
            relations: {
                teacher: true
            }
        });
    }

    public async getClassById(id: number): Promise<Class | null> {
        return await this.classRepository.findOne({
            where: { id },
            relations: {
                teacher: true,
                children: true
            }
        });
    }

    public async createClass(classRoom: Class): Promise<Class> {
        return await this.classRepository.save(classRoom);
    }

    // Teacher DAO methods
    public async getAllTeachers(): Promise<Teacher[]> {
        return await this.teacherRepository.find({
            relations: {
                klass: true
            }
        });
    }

    public async createTeacher(teacher: Teacher): Promise<Teacher> {
        return await this.teacherRepository.save(teacher);
    }

    public async deleteTeacher(id: number): Promise<{ affected?: number }> {
        return await this.teacherRepository.delete(id);
    }

    public async getFamilyById(id: number): Promise<Family | null> {
        return await this.familyRepository.findOne({
            where: { id },
            relations: {
                children: true,
                parent1: true,
                parent2: true
            }
        });
    }
    
    public async getChildrenByFamilyId(familyId: number): Promise<Child[]> {
        return await this.childRepository.find({
            where: { family: { id: familyId } },
            relations: {
                family: true
            }
        });
    }

    public async addChildToFamily(familyId: number, childId: number): Promise<Child> {
        const child = await this.childRepository.findOne({where: {id: childId}});
        const family = await this.familyRepository.findOne({where: {id: familyId}});
        child.family = family;
        return await this.childRepository.save(child);
    }
}

export default new MainDAO();