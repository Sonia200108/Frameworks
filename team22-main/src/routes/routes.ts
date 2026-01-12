import { Router } from "express"
import childController from '../controller/childController';
import familyController from "../controller/familyController";
import standardController from "../controller/standardController";
import classController from "../controller/classController";
import teacherController from "../controller/teacherController";
import socketController from '../controller/socketController';

const router = Router()


router.get('/', standardController.getIndexPage);
router.post('/children/submitFormChild', childController.createChildForm);
router.get('/family/add', familyController.createFamily);
router.post('/family/submitFormFamily', familyController.createFamilyForm);
router.get('/children/add', childController.createChild);
router.get('/children/:id', childController.getChildById);
router.get('/children', childController.getAllChildren);
router.get('/families', familyController.getAllFamilies);
router.get('/admin', standardController.getAdminPage);
router.get('/classes', classController.getAllClasses);
router.get('/class/add', classController.createClass);
router.get('/class/:id', classController.getClassById);
router.post('/class/submitFormClass', classController.createClassForm);
router.get('/teachers', teacherController.getAllTeachers);
router.get('/teachers/add', teacherController.createTeacher);
router.post('/teachers/submitFormTeacher', teacherController.createTeacherForm);
router.get('/family/addchild/:id', familyController.addChild);
router.post('/family/addchild/submitFormChildFamily', familyController.addChildForm);
router.put('/family/addchild/submitFormChildFamily', familyController.addChildForm);
router.get('/parents', familyController.getAllParents);
router.get('/family/delete/:id', familyController.deleteFamily);
router.delete('/family/delete/:id', familyController.deleteFamily);
router.get('/teacher/delete/:id', teacherController.deleteTeacher);
router.delete('/teacher/delete/:id', teacherController.deleteTeacher);

router.get('/socket', (req, res) => {
    res.render('socket', { title: 'Child Count' });
  });

//TODO: 404 page
export default router