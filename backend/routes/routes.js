const express= require('express');
const { login }=require('../controllers/login_controller');
const { signup } = require('../controllers/signup_controller');
const { create_group } = require('../controllers/student_create_group');
const { display_group }=require('../controllers/display_student');
const { student_evaluation }=require('../controllers/student_evaluation');
const { display_all }=require('../controllers/display_all');
const { update_grp }=require('../controllers/update_group');
const { delete_grp }=require('../controllers/delete_group');
const { view_evaluation }=require('../controllers/view_evaluation');
const { display_teams }=require('../controllers/display_teams');
const { evaluate_team }=require('../controllers/evaluate_team');
const { fetch_supervisors }=require('../controllers/fetch_supervisors');
const { fetch_students }=require('../controllers/fetch_students');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router= express.Router();

router.post('/login',login);
router.post('/signup',signup);
router.post('/create_group',create_group);
router.get('/display_group',display_group);
router.get('/student_evaluation',student_evaluation);
router.get('/display_all',display_all);
router.patch('/update_group/:_id',update_grp);
router.delete('/delete_group/:_id',delete_grp);
router.get('/view_evaluation/:_id',view_evaluation);
router.get('/display_teams',display_teams);
router.post('/evaluate_team/:_id',evaluate_team);
router.get('/fetch_supervisors',fetch_supervisors);
router.get('/fetch_students',fetch_students);

module.exports = router;