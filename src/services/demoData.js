/**
 * HND Facial Attendance System - Demo Data
 * Comprehensive database matching Haryana Hans Nayi Disha school requirements
 */
import { subDays, format } from 'date-fns';
import { ATTENDANCE_STATUS, USER_ROLES } from '../utils/constants';

export const demoSchool = {
  id: 'school-001',
  name: 'The Hans Nayi Disha Learning Centre',
  code: 'HND-HR4237',
  district: 'Gurugram',
  block: 'Gurugram',
  address: 'Haryana, India',
  phone: '+91-9876543210',
  principalName: 'Ms. Seema',
  establishedYear: 2015,
  academicYear: '2026-2027',
};

export const demoUsers = [
  {
    "id": "teacher-jaiwanti",
    "name": "Jaiwanti Bisht",
    "email": "jaiwanti@hnd.edu",
    "password": "teacher123",
    "role": "teacher",
    "schoolId": "school-001",
    "assignedClasses": [
      "class-ukg"
    ],
    "phone": "+91-98765-00001",
    "avatar": "JB"
  },
  {
    "id": "teacher-ritika",
    "name": "Ritika",
    "email": "ritika@hnd.edu",
    "password": "teacher123",
    "role": "teacher",
    "schoolId": "school-001",
    "assignedClasses": [
      "class-1a"
    ],
    "phone": "+91-98765-00002",
    "avatar": "RT"
  },
  {
    "id": "teacher-gayatree",
    "name": "Gayatree Sahoo",
    "email": "gayatree@hnd.edu",
    "password": "teacher123",
    "role": "teacher",
    "schoolId": "school-001",
    "assignedClasses": [
      "class-2a"
    ],
    "phone": "+91-98765-00003",
    "avatar": "GS"
  },
  {
    "id": "teacher-debasmita",
    "name": "Debasmita Ghosh",
    "email": "debasmita@hnd.edu",
    "password": "teacher123",
    "role": "teacher",
    "schoolId": "school-001",
    "assignedClasses": [
      "class-3a"
    ],
    "phone": "+91-98765-00004",
    "avatar": "DG"
  },
  {
    "id": "teacher-satyendra",
    "name": "Satyendra Dhakad",
    "email": "satyendra@hnd.edu",
    "password": "teacher123",
    "role": "teacher",
    "schoolId": "school-001",
    "assignedClasses": [
      "class-4a"
    ],
    "phone": "+91-98765-00005",
    "avatar": "SD"
  },
  {
    "id": "teacher-anita",
    "name": "Anita Kumari",
    "email": "anita@hnd.edu",
    "password": "teacher123",
    "role": "teacher",
    "schoolId": "school-001",
    "assignedClasses": [
      "class-5a"
    ],
    "phone": "+91-98765-00006",
    "avatar": "AK"
  },
  {
    "id": "teacher-abhinesh",
    "name": "Abhinesh Kumar",
    "email": "abhinesh@hnd.edu",
    "password": "teacher123",
    "role": "teacher",
    "schoolId": "school-001",
    "assignedClasses": [],
    "phone": "+91-98765-00007",
    "avatar": "AK"
  },
  {
    "id": "headmaster-seema",
    "name": "Ms. Seema",
    "email": "seema@hnd.edu",
    "password": "headmaster123",
    "role": "headmaster",
    "schoolId": "school-001",
    "phone": "+91-98765-99999",
    "avatar": "MS"
  },
  {
    "id": "admin-user",
    "name": "Admin User",
    "email": "admin@hnd.edu",
    "password": "admin123",
    "role": "admin",
    "schoolId": "school-001",
    "phone": "+91-98765-88888",
    "avatar": "AD"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-14",
    "name": "Parent of Roh",
    "email": "parent_cscbv-hr4237-25-14@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-14"
    ],
    "phone": "9599846877",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9599846877",
    "name": "Parent of Roh",
    "email": "9599846877@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-14"
    ],
    "phone": "9599846877",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-15",
    "name": "Parent of R",
    "email": "parent_cscbv-hr4237-25-15@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-15"
    ],
    "phone": "9749523260",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9749523260",
    "name": "Parent of R",
    "email": "9749523260@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-15"
    ],
    "phone": "9749523260",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-17",
    "name": "Parent of R",
    "email": "parent_cscbv-hr4237-25-17@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-17"
    ],
    "phone": "9319644156",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9319644156",
    "name": "Parent of R",
    "email": "9319644156@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-17"
    ],
    "phone": "9319644156",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-12",
    "name": "Parent of Pragya",
    "email": "parent_cscbv-hr4237-25-12@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-12"
    ],
    "phone": "9648437248",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9648437248",
    "name": "Parent of Pragya",
    "email": "9648437248@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-12"
    ],
    "phone": "9648437248",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-1",
    "name": "Parent of Anant Kumar",
    "email": "parent_cscbv-hr4237-25-1@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-1"
    ],
    "phone": "7290944800",
    "avatar": "P"
  },
  {
    "id": "parent-phone-7290944800",
    "name": "Parent of Anant Kumar",
    "email": "7290944800@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-1"
    ],
    "phone": "7290944800",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-26-127",
    "name": "Parent of Kart",
    "email": "parent_cscbv-hr4237-26-127@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-127"
    ],
    "phone": "8860479329",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8860479329",
    "name": "Parent of Kart",
    "email": "8860479329@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-127"
    ],
    "phone": "8860479329",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-8",
    "name": "Parent of Joyd",
    "email": "parent_cscbv-hr4237-25-8@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-8"
    ],
    "phone": "9667980959",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9667980959",
    "name": "Parent of Joyd",
    "email": "9667980959@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-8"
    ],
    "phone": "9667980959",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-7",
    "name": "Parent of Har",
    "email": "parent_cscbv-hr4237-25-7@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-7"
    ],
    "phone": "9971029152",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9971029152",
    "name": "Parent of Har",
    "email": "9971029152@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-7"
    ],
    "phone": "9971029152",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-4",
    "name": "Parent of Arfaj Alam",
    "email": "parent_cscbv-hr4237-25-4@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-4"
    ],
    "phone": "9593610918",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9593610918",
    "name": "Parent of Arfaj Alam",
    "email": "9593610918@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-4"
    ],
    "phone": "9593610918",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-26",
    "name": "Parent of Sab",
    "email": "parent_cscbv-hr4237-25-26@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-26"
    ],
    "phone": "9718549189",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9718549189",
    "name": "Parent of Sab",
    "email": "9718549189@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-26"
    ],
    "phone": "9718549189",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-20",
    "name": "Parent of Rudr Das",
    "email": "parent_cscbv-hr4237-25-20@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-20"
    ],
    "phone": "9310231476",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9310231476",
    "name": "Parent of Rudr Das",
    "email": "9310231476@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-20"
    ],
    "phone": "9310231476",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-16",
    "name": "Parent of Rana Ru",
    "email": "parent_cscbv-hr4237-25-16@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-16"
    ],
    "phone": "9871616902",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9871616902",
    "name": "Parent of Rana Ru",
    "email": "9871616902@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-16"
    ],
    "phone": "9871616902",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-11",
    "name": "Parent of Mohammod Sel",
    "email": "parent_cscbv-hr4237-25-11@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-11"
    ],
    "phone": "9625089953",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9625089953",
    "name": "Parent of Mohammod Sel",
    "email": "9625089953@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-11"
    ],
    "phone": "9625089953",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-19",
    "name": "Parent of Richu Kumari",
    "email": "parent_cscbv-hr4237-25-19@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-19"
    ],
    "phone": "9341461862",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9341461862",
    "name": "Parent of Richu Kumari",
    "email": "9341461862@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-19"
    ],
    "phone": "9341461862",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-2",
    "name": "Parent of Anamika Das",
    "email": "parent_cscbv-hr4237-25-2@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-2"
    ],
    "phone": "8695971998",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8695971998",
    "name": "Parent of Anamika Das",
    "email": "8695971998@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-2"
    ],
    "phone": "8695971998",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-23",
    "name": "Parent of Arjuma Khatun",
    "email": "parent_cscbv-hr4237-25-23@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-23"
    ],
    "phone": "7800868527",
    "avatar": "P"
  },
  {
    "id": "parent-phone-7800868527",
    "name": "Parent of Arjuma Khatun",
    "email": "7800868527@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-23"
    ],
    "phone": "7800868527",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-18",
    "name": "Parent of Riya Das",
    "email": "parent_cscbv-hr4237-25-18@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-18"
    ],
    "phone": "9315260220",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9315260220",
    "name": "Parent of Riya Das",
    "email": "9315260220@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-18"
    ],
    "phone": "9315260220",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-3",
    "name": "Parent of Arman Hossain",
    "email": "parent_cscbv-hr4237-25-3@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-3"
    ],
    "phone": "9310851149",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9310851149",
    "name": "Parent of Arman Hossain",
    "email": "9310851149@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-3"
    ],
    "phone": "9310851149",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-22",
    "name": "Parent of Taniya Bashyal",
    "email": "parent_cscbv-hr4237-25-22@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-22"
    ],
    "phone": "9599846877",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-77",
    "name": "Parent of Tanusree Das",
    "email": "parent_cscbv-hr4237-25-77@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-77"
    ],
    "phone": "9667980959",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-37",
    "name": "Parent of Arju",
    "email": "parent_cscbv-hr4237-25-37@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-37"
    ],
    "phone": "7303619687",
    "avatar": "P"
  },
  {
    "id": "parent-phone-7303619687",
    "name": "Parent of Arju",
    "email": "7303619687@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-37"
    ],
    "phone": "7303619687",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-38",
    "name": "Parent of Aruhi Khatun",
    "email": "parent_cscbv-hr4237-25-38@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-38"
    ],
    "phone": "9811465780",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9811465780",
    "name": "Parent of Aruhi Khatun",
    "email": "9811465780@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-38"
    ],
    "phone": "9811465780",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-84",
    "name": "Parent of Rahul Das",
    "email": "parent_cscbv-hr4237-25-84@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-84"
    ],
    "phone": "7827599824",
    "avatar": "P"
  },
  {
    "id": "parent-phone-7827599824",
    "name": "Parent of Rahul Das",
    "email": "7827599824@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-84"
    ],
    "phone": "7827599824",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-82",
    "name": "Parent of Prem Kumar",
    "email": "parent_cscbv-hr4237-25-82@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-82"
    ],
    "phone": "7827599824",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-70",
    "name": "Parent of Sonam Hatun",
    "email": "parent_cscbv-hr4237-25-70@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-70"
    ],
    "phone": "9647789008",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9647789008",
    "name": "Parent of Sonam Hatun",
    "email": "9647789008@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-70"
    ],
    "phone": "9647789008",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-65",
    "name": "Parent of Rupankar Saha",
    "email": "parent_cscbv-hr4237-25-65@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-65"
    ],
    "phone": "7303303721",
    "avatar": "P"
  },
  {
    "id": "parent-phone-7303303721",
    "name": "Parent of Rupankar Saha",
    "email": "7303303721@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-65"
    ],
    "phone": "7303303721",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-58",
    "name": "Parent of Raj Das",
    "email": "parent_cscbv-hr4237-25-58@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-58"
    ],
    "phone": "9319883049",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9319883049",
    "name": "Parent of Raj Das",
    "email": "9319883049@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-58"
    ],
    "phone": "9319883049",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-61",
    "name": "Parent of Ritesh Kumar",
    "email": "parent_cscbv-hr4237-25-61@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-61"
    ],
    "phone": "9717413256",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9717413256",
    "name": "Parent of Ritesh Kumar",
    "email": "9717413256@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-61"
    ],
    "phone": "9717413256",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-52",
    "name": "Parent of Pranav",
    "email": "parent_cscbv-hr4237-25-52@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-52"
    ],
    "phone": "8447519414",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8447519414",
    "name": "Parent of Pranav",
    "email": "8447519414@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-52"
    ],
    "phone": "8447519414",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-50",
    "name": "Parent of Devraj Chauhan",
    "email": "parent_cscbv-hr4237-25-50@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-50"
    ],
    "phone": "9910193572",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9910193572",
    "name": "Parent of Devraj Chauhan",
    "email": "9910193572@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-50"
    ],
    "phone": "9910193572",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-39",
    "name": "Parent of Aryan Kumar",
    "email": "parent_cscbv-hr4237-25-39@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-39"
    ],
    "phone": "8376829125",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8376829125",
    "name": "Parent of Aryan Kumar",
    "email": "8376829125@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-39"
    ],
    "phone": "8376829125",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-79",
    "name": "Parent of Tori Das",
    "email": "parent_cscbv-hr4237-25-79@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-79"
    ],
    "phone": "9933455646",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9933455646",
    "name": "Parent of Tori Das",
    "email": "9933455646@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-79"
    ],
    "phone": "9933455646",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-69",
    "name": "Parent of Sayantika Das",
    "email": "parent_cscbv-hr4237-25-69@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-69"
    ],
    "phone": "7430803743",
    "avatar": "P"
  },
  {
    "id": "parent-phone-7430803743",
    "name": "Parent of Sayantika Das",
    "email": "7430803743@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-69"
    ],
    "phone": "7430803743",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-40",
    "name": "Parent of Bhoomi Das",
    "email": "parent_cscbv-hr4237-25-40@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-40"
    ],
    "phone": "8851075586",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8851075586",
    "name": "Parent of Bhoomi Das",
    "email": "8851075586@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-40"
    ],
    "phone": "8851075586",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-74",
    "name": "Parent of Sudip Saha",
    "email": "parent_cscbv-hr4237-25-74@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-74"
    ],
    "phone": "8250028391",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8250028391",
    "name": "Parent of Sudip Saha",
    "email": "8250028391@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-74"
    ],
    "phone": "8250028391",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-51",
    "name": "Parent of Mustafijur Rahaman",
    "email": "parent_cscbv-hr4237-25-51@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-51"
    ],
    "phone": "9643557327",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9643557327",
    "name": "Parent of Mustafijur Rahaman",
    "email": "9643557327@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-51"
    ],
    "phone": "9643557327",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-55",
    "name": "Parent of Prince Kumar",
    "email": "parent_cscbv-hr4237-25-55@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-55"
    ],
    "phone": "9953422754",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9953422754",
    "name": "Parent of Prince Kumar",
    "email": "9953422754@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-55"
    ],
    "phone": "9953422754",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-46",
    "name": "Parent of Bikram Das",
    "email": "parent_cscbv-hr4237-25-46@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-46"
    ],
    "phone": "9599831884",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9599831884",
    "name": "Parent of Bikram Das",
    "email": "9599831884@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-46"
    ],
    "phone": "9599831884",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-47",
    "name": "Parent of Biswajit Das",
    "email": "parent_cscbv-hr4237-25-47@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-47"
    ],
    "phone": "8130799526",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8130799526",
    "name": "Parent of Biswajit Das",
    "email": "8130799526@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-47"
    ],
    "phone": "8130799526",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-63",
    "name": "Parent of Royan Alam",
    "email": "parent_cscbv-hr4237-25-63@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-63"
    ],
    "phone": "9354463695",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9354463695",
    "name": "Parent of Royan Alam",
    "email": "9354463695@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-63"
    ],
    "phone": "9354463695",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-94",
    "name": "Parent of Priyank Chauhan",
    "email": "parent_cscbv-hr4237-25-94@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-94"
    ],
    "phone": "9971239418",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9971239418",
    "name": "Parent of Priyank Chauhan",
    "email": "9971239418@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-94"
    ],
    "phone": "9971239418",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-72",
    "name": "Parent of Jai Bhati",
    "email": "parent_cscbv-hr4237-25-72@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-72"
    ],
    "phone": "9650920096",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9650920096",
    "name": "Parent of Jai Bhati",
    "email": "9650920096@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-72"
    ],
    "phone": "9650920096",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-66",
    "name": "Parent of Devansh",
    "email": "parent_cscbv-hr4237-25-66@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-66"
    ],
    "phone": "7011034553",
    "avatar": "P"
  },
  {
    "id": "parent-phone-7011034553",
    "name": "Parent of Devansh",
    "email": "7011034553@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-66"
    ],
    "phone": "7011034553",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-111",
    "name": "Parent of Roshan Kumar Singh",
    "email": "parent_cscbv-hr4237-25-111@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-111"
    ],
    "phone": "9892657221",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9892657221",
    "name": "Parent of Roshan Kumar Singh",
    "email": "9892657221@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-111"
    ],
    "phone": "9892657221",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-100",
    "name": "Parent of Radhika Kumari",
    "email": "parent_cscbv-hr4237-25-100@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-100"
    ],
    "phone": "9717206179",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9717206179",
    "name": "Parent of Radhika Kumari",
    "email": "9717206179@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-100"
    ],
    "phone": "9717206179",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-75",
    "name": "Parent of Manisha Kumari",
    "email": "parent_cscbv-hr4237-25-75@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-75"
    ],
    "phone": "8969595779",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8969595779",
    "name": "Parent of Manisha Kumari",
    "email": "8969595779@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-75"
    ],
    "phone": "8969595779",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-62",
    "name": "Parent of Ayesha Khatun",
    "email": "parent_cscbv-hr4237-25-62@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-62"
    ],
    "phone": "9625449685",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9625449685",
    "name": "Parent of Ayesha Khatun",
    "email": "9625449685@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-62"
    ],
    "phone": "9625449685",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-119",
    "name": "Parent of Fiza Parveen",
    "email": "parent_cscbv-hr4237-25-119@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-119"
    ],
    "phone": "9718549189",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-108",
    "name": "Parent of Sangita Jana",
    "email": "parent_cscbv-hr4237-25-108@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-108"
    ],
    "phone": "7585839355",
    "avatar": "P"
  },
  {
    "id": "parent-phone-7585839355",
    "name": "Parent of Sangita Jana",
    "email": "7585839355@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-108"
    ],
    "phone": "7585839355",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-54",
    "name": "Parent of Ankush Barua",
    "email": "parent_cscbv-hr4237-25-54@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-54"
    ],
    "phone": "8100162919",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8100162919",
    "name": "Parent of Ankush Barua",
    "email": "8100162919@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-54"
    ],
    "phone": "8100162919",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-116",
    "name": "Parent of Ranjan Umar",
    "email": "parent_cscbv-hr4237-25-116@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-116"
    ],
    "phone": "6366944549",
    "avatar": "P"
  },
  {
    "id": "parent-phone-6366944549",
    "name": "Parent of Ranjan Umar",
    "email": "6366944549@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-116"
    ],
    "phone": "6366944549",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-113",
    "name": "Parent of Raghav Kumar",
    "email": "parent_cscbv-hr4237-25-113@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-113"
    ],
    "phone": "8743067270",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8743067270",
    "name": "Parent of Raghav Kumar",
    "email": "8743067270@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-113"
    ],
    "phone": "8743067270",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-106",
    "name": "Parent of Ranabir Das",
    "email": "parent_cscbv-hr4237-25-106@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-106"
    ],
    "phone": "8826053280",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8826053280",
    "name": "Parent of Ranabir Das",
    "email": "8826053280@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-106"
    ],
    "phone": "8826053280",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-26-122",
    "name": "Parent of Lakshina Khatun",
    "email": "parent_cscbv-hr4237-26-122@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-122"
    ],
    "phone": "8207260500",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8207260500",
    "name": "Parent of Lakshina Khatun",
    "email": "8207260500@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-122"
    ],
    "phone": "8207260500",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-85",
    "name": "Parent of Pihu Das",
    "email": "parent_cscbv-hr4237-25-85@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-85"
    ],
    "phone": "9310148253",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9310148253",
    "name": "Parent of Pihu Das",
    "email": "9310148253@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-85"
    ],
    "phone": "9310148253",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-57",
    "name": "Parent of Ashwani",
    "email": "parent_cscbv-hr4237-25-57@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-57"
    ],
    "phone": "9648437248",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-41",
    "name": "Parent of Rimika Sabnam",
    "email": "parent_cscbv-hr4237-25-41@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-41"
    ],
    "phone": "6296232105",
    "avatar": "P"
  },
  {
    "id": "parent-phone-6296232105",
    "name": "Parent of Rimika Sabnam",
    "email": "6296232105@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-41"
    ],
    "phone": "6296232105",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-44",
    "name": "Parent of Sonali Das",
    "email": "parent_cscbv-hr4237-25-44@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-44"
    ],
    "phone": "8130076462",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8130076462",
    "name": "Parent of Sonali Das",
    "email": "8130076462@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-44"
    ],
    "phone": "8130076462",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-35",
    "name": "Parent of Priyanka Yadav",
    "email": "parent_cscbv-hr4237-25-35@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-35"
    ],
    "phone": "8130106950",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8130106950",
    "name": "Parent of Priyanka Yadav",
    "email": "8130106950@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-35"
    ],
    "phone": "8130106950",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-33",
    "name": "Parent of Maya",
    "email": "parent_cscbv-hr4237-25-33@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-33"
    ],
    "phone": "8376829125",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-32",
    "name": "Parent of Jeet Das",
    "email": "parent_cscbv-hr4237-25-32@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-32"
    ],
    "phone": "9002343408",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9002343408",
    "name": "Parent of Jeet Das",
    "email": "9002343408@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-32"
    ],
    "phone": "9002343408",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-49",
    "name": "Parent of Najiya Par",
    "email": "parent_cscbv-hr4237-25-49@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-49"
    ],
    "phone": "9871505241",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9871505241",
    "name": "Parent of Najiya Par",
    "email": "9871505241@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-49"
    ],
    "phone": "9871505241",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-43",
    "name": "Parent of Shuhani Kumari",
    "email": "parent_cscbv-hr4237-25-43@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-43"
    ],
    "phone": "9654769623",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9654769623",
    "name": "Parent of Shuhani Kumari",
    "email": "9654769623@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-43"
    ],
    "phone": "9654769623",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-36",
    "name": "Parent of Rahima Khatun",
    "email": "parent_cscbv-hr4237-25-36@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-36"
    ],
    "phone": "8377858176",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8377858176",
    "name": "Parent of Rahima Khatun",
    "email": "8377858176@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-36"
    ],
    "phone": "8377858176",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-31",
    "name": "Parent of Chhanda Ruidas",
    "email": "parent_cscbv-hr4237-25-31@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-31"
    ],
    "phone": "8810660685",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8810660685",
    "name": "Parent of Chhanda Ruidas",
    "email": "8810660685@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-31"
    ],
    "phone": "8810660685",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-34",
    "name": "Parent of Nandani Kumari",
    "email": "parent_cscbv-hr4237-25-34@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-34"
    ],
    "phone": "8228946480",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8228946480",
    "name": "Parent of Nandani Kumari",
    "email": "8228946480@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-34"
    ],
    "phone": "8228946480",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-42",
    "name": "Parent of Shi",
    "email": "parent_cscbv-hr4237-25-42@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-42"
    ],
    "phone": "9650025890",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9650025890",
    "name": "Parent of Shi",
    "email": "9650025890@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-42"
    ],
    "phone": "9650025890",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-30",
    "name": "Parent of Bha",
    "email": "parent_cscbv-hr4237-25-30@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-30"
    ],
    "phone": "8851075586",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-28",
    "name": "Parent of Ankush Hazra",
    "email": "parent_cscbv-hr4237-25-28@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-28"
    ],
    "phone": "9749151912",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9749151912",
    "name": "Parent of Ankush Hazra",
    "email": "9749151912@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-28"
    ],
    "phone": "9749151912",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-48",
    "name": "Parent of Tanusree Mandol",
    "email": "parent_cscbv-hr4237-25-48@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-48"
    ],
    "phone": "8918121263",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8918121263",
    "name": "Parent of Tanusree Mandol",
    "email": "8918121263@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-48"
    ],
    "phone": "8918121263",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-26-120",
    "name": "Parent of Sanam Khatun",
    "email": "parent_cscbv-hr4237-26-120@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-120"
    ],
    "phone": "7042343278",
    "avatar": "P"
  },
  {
    "id": "parent-phone-7042343278",
    "name": "Parent of Sanam Khatun",
    "email": "7042343278@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-120"
    ],
    "phone": "7042343278",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-76",
    "name": "Parent of Keshav Kumar",
    "email": "parent_cscbv-hr4237-25-76@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-76"
    ],
    "phone": "7836914354",
    "avatar": "P"
  },
  {
    "id": "parent-phone-7836914354",
    "name": "Parent of Keshav Kumar",
    "email": "7836914354@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-76"
    ],
    "phone": "7836914354",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-60",
    "name": "Parent of Aryan Harma",
    "email": "parent_cscbv-hr4237-25-60@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-60"
    ],
    "phone": "9717988171",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9717988171",
    "name": "Parent of Aryan Harma",
    "email": "9717988171@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-60"
    ],
    "phone": "9717988171",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-91",
    "name": "Parent of Shikha Das",
    "email": "parent_cscbv-hr4237-25-91@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-91"
    ],
    "phone": "9355495528",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9355495528",
    "name": "Parent of Shikha Das",
    "email": "9355495528@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-91"
    ],
    "phone": "9355495528",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-83",
    "name": "Parent of Saniya Sultana",
    "email": "parent_cscbv-hr4237-25-83@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-83"
    ],
    "phone": "6290125568",
    "avatar": "P"
  },
  {
    "id": "parent-phone-6290125568",
    "name": "Parent of Saniya Sultana",
    "email": "6290125568@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-83"
    ],
    "phone": "6290125568",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-64",
    "name": "Parent of Anchal Kumari",
    "email": "parent_cscbv-hr4237-25-64@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-64"
    ],
    "phone": "9334708605",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9334708605",
    "name": "Parent of Anchal Kumari",
    "email": "9334708605@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-64"
    ],
    "phone": "9334708605",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-53",
    "name": "Parent of Anu Par",
    "email": "parent_cscbv-hr4237-25-53@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-53"
    ],
    "phone": "9205744689",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9205744689",
    "name": "Parent of Anu Par",
    "email": "9205744689@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-53"
    ],
    "phone": "9205744689",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-118",
    "name": "Parent of Himanshi Wiswakarma",
    "email": "parent_cscbv-hr4237-25-118@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-118"
    ],
    "phone": "8595351990",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8595351990",
    "name": "Parent of Himanshi Wiswakarma",
    "email": "8595351990@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-118"
    ],
    "phone": "8595351990",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-109",
    "name": "Parent of Sahina Khatun",
    "email": "parent_cscbv-hr4237-25-109@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-109"
    ],
    "phone": "7835984914",
    "avatar": "P"
  },
  {
    "id": "parent-phone-7835984914",
    "name": "Parent of Sahina Khatun",
    "email": "7835984914@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-109"
    ],
    "phone": "7835984914",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-26-121",
    "name": "Parent of Subhadip Das",
    "email": "parent_cscbv-hr4237-26-121@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-121"
    ],
    "phone": "7047341931",
    "avatar": "P"
  },
  {
    "id": "parent-phone-7047341931",
    "name": "Parent of Subhadip Das",
    "email": "7047341931@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-121"
    ],
    "phone": "7047341931",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-96",
    "name": "Parent of Sujan Rui Das",
    "email": "parent_cscbv-hr4237-25-96@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-96"
    ],
    "phone": "9382341476",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9382341476",
    "name": "Parent of Sujan Rui Das",
    "email": "9382341476@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-96"
    ],
    "phone": "9382341476",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-92",
    "name": "Parent of Shi",
    "email": "parent_cscbv-hr4237-25-92@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-92"
    ],
    "phone": "8882156576",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8882156576",
    "name": "Parent of Shi",
    "email": "8882156576@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-92"
    ],
    "phone": "8882156576",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-87",
    "name": "Parent of Sakibul Sk",
    "email": "parent_cscbv-hr4237-25-87@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-87"
    ],
    "phone": "9643557327",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-78",
    "name": "Parent of Rohit Sk",
    "email": "parent_cscbv-hr4237-25-78@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-78"
    ],
    "phone": "8348795895",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8348795895",
    "name": "Parent of Rohit Sk",
    "email": "8348795895@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-78"
    ],
    "phone": "8348795895",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-56",
    "name": "Parent of Anit Maity",
    "email": "parent_cscbv-hr4237-25-56@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-56"
    ],
    "phone": "8743099006",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8743099006",
    "name": "Parent of Anit Maity",
    "email": "8743099006@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-56"
    ],
    "phone": "8743099006",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-114",
    "name": "Parent of Eshant Kumar Mandal",
    "email": "parent_cscbv-hr4237-25-114@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-114"
    ],
    "phone": "9334954286",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9334954286",
    "name": "Parent of Eshant Kumar Mandal",
    "email": "9334954286@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-114"
    ],
    "phone": "9334954286",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-26-128",
    "name": "Parent of Mahira Khatun",
    "email": "parent_cscbv-hr4237-26-128@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-128"
    ],
    "phone": "7042343278",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-26-124",
    "name": "Parent of Ahana Hazra",
    "email": "parent_cscbv-hr4237-26-124@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-124"
    ],
    "phone": "8597829687",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8597829687",
    "name": "Parent of Ahana Hazra",
    "email": "8597829687@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-124"
    ],
    "phone": "8597829687",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-26-125",
    "name": "Parent of Barsha Kumari",
    "email": "parent_cscbv-hr4237-26-125@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-125"
    ],
    "phone": "9354784298",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9354784298",
    "name": "Parent of Barsha Kumari",
    "email": "9354784298@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-125"
    ],
    "phone": "9354784298",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-26-129",
    "name": "Parent of Shakib Ali",
    "email": "parent_cscbv-hr4237-26-129@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-129"
    ],
    "phone": "8860338481",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8860338481",
    "name": "Parent of Shakib Ali",
    "email": "8860338481@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-129"
    ],
    "phone": "8860338481",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-26-123",
    "name": "Parent of Ayan Sekh",
    "email": "parent_cscbv-hr4237-26-123@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-123"
    ],
    "phone": "9136240529",
    "avatar": "P"
  },
  {
    "id": "parent-phone-9136240529",
    "name": "Parent of Ayan Sekh",
    "email": "9136240529@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-123"
    ],
    "phone": "9136240529",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-26-126",
    "name": "Parent of Gourav",
    "email": "parent_cscbv-hr4237-26-126@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-126"
    ],
    "phone": "8077952730",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8077952730",
    "name": "Parent of Gourav",
    "email": "8077952730@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-26-126"
    ],
    "phone": "8077952730",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-6",
    "name": "Parent of Dilkhush Kumar",
    "email": "parent_cscbv-hr4237-25-6@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-6"
    ],
    "phone": "9341461862",
    "avatar": "P"
  },
  {
    "id": "parent-adm-cscbv-hr4237-25-5",
    "name": "Parent of Debabrata Bala",
    "email": "parent_cscbv-hr4237-25-5@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-5"
    ],
    "phone": "8920903662",
    "avatar": "P"
  },
  {
    "id": "parent-phone-8920903662",
    "name": "Parent of Debabrata Bala",
    "email": "8920903662@hnd.edu",
    "password": "parent123",
    "role": "parent",
    "schoolId": "school-001",
    "childIds": [
      "student-cscbv-hr4237-25-5"
    ],
    "phone": "8920903662",
    "avatar": "P"
  }
];

export const demoClasses = [
  {
    "id": "class-ukg",
    "name": "UKG",
    "section": "A",
    "grade": 0.5,
    "schoolId": "school-001",
    "teacherId": "teacher-jaiwanti",
    "teacherName": "Jaiwanti Bisht (Balwadi)"
  },
  {
    "id": "class-1a",
    "name": "1",
    "section": "A",
    "grade": 1,
    "schoolId": "school-001",
    "teacherId": "teacher-ritika",
    "teacherName": "Ritika (Group 1 - Rose)"
  },
  {
    "id": "class-2a",
    "name": "2",
    "section": "A",
    "grade": 2,
    "schoolId": "school-001",
    "teacherId": "teacher-gayatree",
    "teacherName": "Gayatree Sahoo (Group 2 - Orchid)"
  },
  {
    "id": "class-3a",
    "name": "3",
    "section": "A",
    "grade": 3,
    "schoolId": "school-001",
    "teacherId": "teacher-debasmita",
    "teacherName": "Debasmita Ghosh (Group 3 - Lily)"
  },
  {
    "id": "class-4a",
    "name": "4",
    "section": "A",
    "grade": 4,
    "schoolId": "school-001",
    "teacherId": "teacher-satyendra",
    "teacherName": "Satyendra Dhakad (Group 4 - Daisy)"
  },
  {
    "id": "class-5a",
    "name": "5",
    "section": "A",
    "grade": 5,
    "schoolId": "school-001",
    "teacherId": "teacher-anita",
    "teacherName": "Anita Kumari (Group 5 - Marigold)"
  }
];

export const demoStudents = [
  {
    "id": "student-cscbv-hr4237-25-14",
    "admissionNo": "CSCBV-HR4237-25-14",
    "name": "Roh",
    "rollNo": 1,
    "classId": "class-1a",
    "className": "Class I-A",
    "grade": 1,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9599846877",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "R",
    "feesPaid": 1000,
    "fatherName": "Sonu Boshal",
    "motherName": "Basanti Boshal"
  },
  {
    "id": "student-cscbv-hr4237-25-15",
    "admissionNo": "CSCBV-HR4237-25-15",
    "name": "R",
    "rollNo": 2,
    "classId": "class-1a",
    "className": "Class I-A",
    "grade": 1,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9749523260",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "R",
    "feesPaid": 400,
    "fatherName": "Aliul Sk",
    "motherName": "Rina Khatun"
  },
  {
    "id": "student-cscbv-hr4237-25-17",
    "admissionNo": "CSCBV-HR4237-25-17",
    "name": "R",
    "rollNo": 3,
    "classId": "class-1a",
    "className": "Class I-A",
    "grade": 1,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9319644156",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "R",
    "feesPaid": 800,
    "fatherName": "Rituraj Mandal",
    "motherName": "Soni Kumari"
  },
  {
    "id": "student-cscbv-hr4237-25-12",
    "admissionNo": "CSCBV-HR4237-25-12",
    "name": "Pragya",
    "rollNo": 4,
    "classId": "class-1a",
    "className": "Class I-A",
    "grade": 1,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9648437248",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "P",
    "feesPaid": 200,
    "fatherName": "Jiledar",
    "motherName": "Sunita Verma"
  },
  {
    "id": "student-cscbv-hr4237-25-1",
    "admissionNo": "CSCBV-HR4237-25-1",
    "name": "Anant Kumar",
    "rollNo": 5,
    "classId": "class-1a",
    "className": "Class I-A",
    "grade": 1,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "7290944800",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "AK",
    "feesPaid": 400,
    "fatherName": "Mahadev Mukhiya",
    "motherName": "Pinki Devi"
  },
  {
    "id": "student-cscbv-hr4237-26-127",
    "admissionNo": "CSCBV-HR4237-26-127",
    "name": "Kart",
    "rollNo": 6,
    "classId": "class-1a",
    "className": "Class I-A",
    "grade": 1,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "8860479329",
    "enrollmentDate": "06-02-2026",
    "faceRegistered": false,
    "avatar": "K",
    "feesPaid": 0,
    "fatherName": "Raj Kumar",
    "motherName": "Sonam"
  },
  {
    "id": "student-cscbv-hr4237-25-8",
    "admissionNo": "CSCBV-HR4237-25-8",
    "name": "Joyd",
    "rollNo": 7,
    "classId": "class-1a",
    "className": "Class I-A",
    "grade": 1,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9667980959",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "J",
    "feesPaid": 800,
    "fatherName": "Jugal Das",
    "motherName": "Sampati Das"
  },
  {
    "id": "student-cscbv-hr4237-25-7",
    "admissionNo": "CSCBV-HR4237-25-7",
    "name": "Har",
    "rollNo": 8,
    "classId": "class-1a",
    "className": "Class I-A",
    "grade": 1,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9971029152",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "H",
    "feesPaid": 1000,
    "fatherName": "Gautam Hazra",
    "motherName": "Madhumita Hazra"
  },
  {
    "id": "student-cscbv-hr4237-25-4",
    "admissionNo": "CSCBV-HR4237-25-4",
    "name": "Arfaj Alam",
    "rollNo": 9,
    "classId": "class-1a",
    "className": "Class I-A",
    "grade": 1,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9593610918",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "AA",
    "feesPaid": 200,
    "fatherName": "Mastak Alam",
    "motherName": "Arjan Khatun"
  },
  {
    "id": "student-cscbv-hr4237-25-26",
    "admissionNo": "CSCBV-HR4237-25-26",
    "name": "Sab",
    "rollNo": 10,
    "classId": "class-1a",
    "className": "Class I-A",
    "grade": 1,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9718549189",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "S",
    "feesPaid": 600,
    "fatherName": "Jasim",
    "motherName": "Khusbu Khatoon"
  },
  {
    "id": "student-cscbv-hr4237-25-20",
    "admissionNo": "CSCBV-HR4237-25-20",
    "name": "Rudr Das",
    "rollNo": 11,
    "classId": "class-1a",
    "className": "Class I-A",
    "grade": 1,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9310231476",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "RD",
    "feesPaid": 0,
    "fatherName": "Ravi Kumar",
    "motherName": "Purnima Devi"
  },
  {
    "id": "student-cscbv-hr4237-25-16",
    "admissionNo": "CSCBV-HR4237-25-16",
    "name": "Rana Ru",
    "rollNo": 12,
    "classId": "class-1a",
    "className": "Class I-A",
    "grade": 1,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9871616902",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "RR",
    "feesPaid": 0,
    "fatherName": "Ranjit Ruidas",
    "motherName": "Silpi Ruidas"
  },
  {
    "id": "student-cscbv-hr4237-25-11",
    "admissionNo": "CSCBV-HR4237-25-11",
    "name": "Mohammod Sel",
    "rollNo": 13,
    "classId": "class-1a",
    "className": "Class I-A",
    "grade": 1,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9625089953",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "MS",
    "feesPaid": 800,
    "fatherName": "Deluyar Hossain",
    "motherName": "Laila Khatun"
  },
  {
    "id": "student-cscbv-hr4237-25-19",
    "admissionNo": "CSCBV-HR4237-25-19",
    "name": "Richu Kumari",
    "rollNo": 14,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9341461862",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "RK",
    "feesPaid": 200,
    "fatherName": "Ramu Ram",
    "motherName": "Laxmi Devi"
  },
  {
    "id": "student-cscbv-hr4237-25-2",
    "admissionNo": "CSCBV-HR4237-25-2",
    "name": "Anamika Das",
    "rollNo": 15,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "8695971998",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "AD",
    "feesPaid": 200,
    "fatherName": "Biswanath Das",
    "motherName": "Anjali Das"
  },
  {
    "id": "student-cscbv-hr4237-25-23",
    "admissionNo": "CSCBV-HR4237-25-23",
    "name": "Arjuma Khatun",
    "rollNo": 16,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "7800868527",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "AK",
    "feesPaid": 1000,
    "fatherName": "Arsat Ali",
    "motherName": "Sahnaj Khatun"
  },
  {
    "id": "student-cscbv-hr4237-25-18",
    "admissionNo": "CSCBV-HR4237-25-18",
    "name": "Riya Das",
    "rollNo": 17,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9315260220",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "RD",
    "feesPaid": 200,
    "fatherName": "Khokhan Das",
    "motherName": "Asha Das"
  },
  {
    "id": "student-cscbv-hr4237-25-3",
    "admissionNo": "CSCBV-HR4237-25-3",
    "name": "Arman Hossain",
    "rollNo": 18,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9310851149",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "AH",
    "feesPaid": 200,
    "fatherName": "Nur Islam",
    "motherName": "Nargis"
  },
  {
    "id": "student-cscbv-hr4237-25-22",
    "admissionNo": "CSCBV-HR4237-25-22",
    "name": "Taniya Bashyal",
    "rollNo": 19,
    "classId": "class-3a",
    "className": "Class III-A",
    "grade": 3,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9599846877",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "TB",
    "feesPaid": 0,
    "fatherName": "Sonu Bashyal",
    "motherName": "Basanti Boshal"
  },
  {
    "id": "student-cscbv-hr4237-25-77",
    "admissionNo": "CSCBV-HR4237-25-77",
    "name": "Tanusree Das",
    "rollNo": 20,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9667980959",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "TD",
    "feesPaid": 1000,
    "fatherName": "Mr. Jugal Das",
    "motherName": "Samapti Das"
  },
  {
    "id": "student-cscbv-hr4237-25-37",
    "admissionNo": "CSCBV-HR4237-25-37",
    "name": "Arju",
    "rollNo": 21,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "7303619687",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "A",
    "feesPaid": 800,
    "fatherName": "Satish Chandra",
    "motherName": "Rama Devi"
  },
  {
    "id": "student-cscbv-hr4237-25-38",
    "admissionNo": "CSCBV-HR4237-25-38",
    "name": "Aruhi Khatun",
    "rollNo": 22,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9811465780",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "AK",
    "feesPaid": 1000,
    "fatherName": "Rahman Shekh",
    "motherName": "Sabiran Khatun"
  },
  {
    "id": "student-cscbv-hr4237-25-84",
    "admissionNo": "CSCBV-HR4237-25-84",
    "name": "Rahul Das",
    "rollNo": 23,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "7827599824",
    "enrollmentDate": "22-07-2025",
    "faceRegistered": false,
    "avatar": "RD",
    "feesPaid": 200,
    "fatherName": "Mrs. Silpi Das",
    "motherName": "Not Provided"
  },
  {
    "id": "student-cscbv-hr4237-25-82",
    "admissionNo": "CSCBV-HR4237-25-82",
    "name": "Prem Kumar",
    "rollNo": 24,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "7827599824",
    "enrollmentDate": "07-07-2025",
    "faceRegistered": false,
    "avatar": "PK",
    "feesPaid": 0,
    "fatherName": "Saroj Ram",
    "motherName": "Meera"
  },
  {
    "id": "student-cscbv-hr4237-25-70",
    "admissionNo": "CSCBV-HR4237-25-70",
    "name": "Sonam Hatun",
    "rollNo": 25,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9647789008",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "SH",
    "feesPaid": 1000,
    "fatherName": "Manju Khatun",
    "motherName": "Not Provided"
  },
  {
    "id": "student-cscbv-hr4237-25-65",
    "admissionNo": "CSCBV-HR4237-25-65",
    "name": "Rupankar Saha",
    "rollNo": 26,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "7303303721",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "RS",
    "feesPaid": 800,
    "fatherName": "Subhankar Saha",
    "motherName": "Rimpa Saha Biswas"
  },
  {
    "id": "student-cscbv-hr4237-25-58",
    "admissionNo": "CSCBV-HR4237-25-58",
    "name": "Raj Das",
    "rollNo": 27,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9319883049",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "RD",
    "feesPaid": 600,
    "fatherName": "Mithun Das",
    "motherName": "Sumati Das"
  },
  {
    "id": "student-cscbv-hr4237-25-61",
    "admissionNo": "CSCBV-HR4237-25-61",
    "name": "Ritesh Kumar",
    "rollNo": 28,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9717413256",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "RK",
    "feesPaid": 400,
    "fatherName": "Rituraj Mandal",
    "motherName": "Soni Kumari"
  },
  {
    "id": "student-cscbv-hr4237-25-52",
    "admissionNo": "CSCBV-HR4237-25-52",
    "name": "Pranav",
    "rollNo": 29,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "8447519414",
    "enrollmentDate": "25-09-2025",
    "faceRegistered": false,
    "avatar": "P",
    "feesPaid": 800,
    "fatherName": "Vishnu",
    "motherName": "Seema"
  },
  {
    "id": "student-cscbv-hr4237-25-50",
    "admissionNo": "CSCBV-HR4237-25-50",
    "name": "Devraj Chauhan",
    "rollNo": 30,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9910193572",
    "enrollmentDate": "25-09-2025",
    "faceRegistered": false,
    "avatar": "DC",
    "feesPaid": 1000,
    "fatherName": "Dharmender",
    "motherName": "Geeta"
  },
  {
    "id": "student-cscbv-hr4237-25-39",
    "admissionNo": "CSCBV-HR4237-25-39",
    "name": "Aryan Kumar",
    "rollNo": 31,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "8376829125",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "AK",
    "feesPaid": 0,
    "fatherName": "Krishn Kumar",
    "motherName": "Kamla Devi"
  },
  {
    "id": "student-cscbv-hr4237-25-79",
    "admissionNo": "CSCBV-HR4237-25-79",
    "name": "Tori Das",
    "rollNo": 32,
    "classId": "class-3a",
    "className": "Class III-A",
    "grade": 3,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9933455646",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "TD",
    "feesPaid": 600,
    "fatherName": "Pritam Das",
    "motherName": "Bulu Sarkar"
  },
  {
    "id": "student-cscbv-hr4237-25-69",
    "admissionNo": "CSCBV-HR4237-25-69",
    "name": "Sayantika Das",
    "rollNo": 33,
    "classId": "class-3a",
    "className": "Class III-A",
    "grade": 3,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "7430803743",
    "enrollmentDate": "22-07-2024",
    "faceRegistered": false,
    "avatar": "SD",
    "feesPaid": 400,
    "fatherName": "Raju Das",
    "motherName": "Shrabani Mondal"
  },
  {
    "id": "student-cscbv-hr4237-25-40",
    "admissionNo": "CSCBV-HR4237-25-40",
    "name": "Bhoomi Das",
    "rollNo": 34,
    "classId": "class-3a",
    "className": "Class III-A",
    "grade": 3,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "8851075586",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "BD",
    "feesPaid": 0,
    "fatherName": "Ranjit Das",
    "motherName": "Sagari Das"
  },
  {
    "id": "student-cscbv-hr4237-25-74",
    "admissionNo": "CSCBV-HR4237-25-74",
    "name": "Sudip Saha",
    "rollNo": 35,
    "classId": "class-3a",
    "className": "Class III-A",
    "grade": 3,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "8250028391",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "SS",
    "feesPaid": 800,
    "fatherName": "Dipankar Saha",
    "motherName": "Susmita Saha"
  },
  {
    "id": "student-cscbv-hr4237-25-51",
    "admissionNo": "CSCBV-HR4237-25-51",
    "name": "Mustafijur Rahaman",
    "rollNo": 36,
    "classId": "class-3a",
    "className": "Class III-A",
    "grade": 3,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9643557327",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "MR",
    "feesPaid": 600,
    "fatherName": "Ajrul Sk",
    "motherName": "Taslima Bibi"
  },
  {
    "id": "student-cscbv-hr4237-25-55",
    "admissionNo": "CSCBV-HR4237-25-55",
    "name": "Prince Kumar",
    "rollNo": 37,
    "classId": "class-3a",
    "className": "Class III-A",
    "grade": 3,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9953422754",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "PK",
    "feesPaid": 200,
    "fatherName": "Shatrudhan Yadav",
    "motherName": "Kajal Yadav"
  },
  {
    "id": "student-cscbv-hr4237-25-46",
    "admissionNo": "CSCBV-HR4237-25-46",
    "name": "Bikram Das",
    "rollNo": 38,
    "classId": "class-3a",
    "className": "Class III-A",
    "grade": 3,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9599831884",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "BD",
    "feesPaid": 600,
    "fatherName": "Bhim Das",
    "motherName": "Purnima Das"
  },
  {
    "id": "student-cscbv-hr4237-25-47",
    "admissionNo": "CSCBV-HR4237-25-47",
    "name": "Biswajit Das",
    "rollNo": 39,
    "classId": "class-3a",
    "className": "Class III-A",
    "grade": 3,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "8130799526",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "BD",
    "feesPaid": 400,
    "fatherName": "Pratipa Das",
    "motherName": "Champa Das"
  },
  {
    "id": "student-cscbv-hr4237-25-63",
    "admissionNo": "CSCBV-HR4237-25-63",
    "name": "Royan Alam",
    "rollNo": 40,
    "classId": "class-2a",
    "className": "Class II-A",
    "grade": 2,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9354463695",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "RA",
    "feesPaid": 0,
    "fatherName": "Jelahar Hossain",
    "motherName": "Sima Khatun"
  },
  {
    "id": "student-cscbv-hr4237-25-94",
    "admissionNo": "CSCBV-HR4237-25-94",
    "name": "Priyank Chauhan",
    "rollNo": 41,
    "classId": "class-3a",
    "className": "Class III-A",
    "grade": 3,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9971239418",
    "enrollmentDate": "04-04-2025",
    "faceRegistered": false,
    "avatar": "PC",
    "feesPaid": 1000,
    "fatherName": "Narender Kumar",
    "motherName": "Neha"
  },
  {
    "id": "student-cscbv-hr4237-25-72",
    "admissionNo": "CSCBV-HR4237-25-72",
    "name": "Jai Bhati",
    "rollNo": 42,
    "classId": "class-3a",
    "className": "Class III-A",
    "grade": 3,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9650920096",
    "enrollmentDate": "04-04-2025",
    "faceRegistered": false,
    "avatar": "JB",
    "feesPaid": 0,
    "fatherName": "Ashok",
    "motherName": "Meenakshi"
  },
  {
    "id": "student-cscbv-hr4237-25-66",
    "admissionNo": "CSCBV-HR4237-25-66",
    "name": "Devansh",
    "rollNo": 43,
    "classId": "class-3a",
    "className": "Class III-A",
    "grade": 3,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "7011034553",
    "enrollmentDate": "04-04-2025",
    "faceRegistered": false,
    "avatar": "D",
    "feesPaid": 400,
    "fatherName": "Rupesh",
    "motherName": "Kumar"
  },
  {
    "id": "student-cscbv-hr4237-25-111",
    "admissionNo": "CSCBV-HR4237-25-111",
    "name": "Roshan Kumar Singh",
    "rollNo": 44,
    "classId": "class-3a",
    "className": "Class III-A",
    "grade": 3,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9892657221",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "RK",
    "feesPaid": 800,
    "fatherName": "Ram Gobind Singh",
    "motherName": "Rani Devi"
  },
  {
    "id": "student-cscbv-hr4237-25-100",
    "admissionNo": "CSCBV-HR4237-25-100",
    "name": "Radhika Kumari",
    "rollNo": 45,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9717206179",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "RK",
    "feesPaid": 400,
    "fatherName": "Ramu Ram",
    "motherName": "Laxmi Devi"
  },
  {
    "id": "student-cscbv-hr4237-25-75",
    "admissionNo": "CSCBV-HR4237-25-75",
    "name": "Manisha Kumari",
    "rollNo": 46,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "8969595779",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "MK",
    "feesPaid": 600,
    "fatherName": "Ramu Ram",
    "motherName": "Laxmi Devi"
  },
  {
    "id": "student-cscbv-hr4237-25-62",
    "admissionNo": "CSCBV-HR4237-25-62",
    "name": "Ayesha Khatun",
    "rollNo": 47,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9625449685",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "AK",
    "feesPaid": 600,
    "fatherName": "Doch Mohammad",
    "motherName": "Sekh"
  },
  {
    "id": "student-cscbv-hr4237-25-119",
    "admissionNo": "CSCBV-HR4237-25-119",
    "name": "Fiza Parveen",
    "rollNo": 48,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9718549189",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "FP",
    "feesPaid": 0,
    "fatherName": "Jasim",
    "motherName": "Khusbu Khatoon"
  },
  {
    "id": "student-cscbv-hr4237-25-108",
    "admissionNo": "CSCBV-HR4237-25-108",
    "name": "Sangita Jana",
    "rollNo": 49,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "7585839355",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "SJ",
    "feesPaid": 600,
    "fatherName": "Tushar",
    "motherName": "Jana"
  },
  {
    "id": "student-cscbv-hr4237-25-54",
    "admissionNo": "CSCBV-HR4237-25-54",
    "name": "Ankush Barua",
    "rollNo": 50,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "8100162919",
    "enrollmentDate": "01-07-2025",
    "faceRegistered": false,
    "avatar": "AB",
    "feesPaid": 0,
    "fatherName": "Avijit Barua",
    "motherName": "Malati"
  },
  {
    "id": "student-cscbv-hr4237-25-116",
    "admissionNo": "CSCBV-HR4237-25-116",
    "name": "Ranjan Umar",
    "rollNo": 51,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "6366944549",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "RU",
    "feesPaid": 200,
    "fatherName": "Murari",
    "motherName": "Mandal"
  },
  {
    "id": "student-cscbv-hr4237-25-113",
    "admissionNo": "CSCBV-HR4237-25-113",
    "name": "Raghav Kumar",
    "rollNo": 52,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "8743067270",
    "enrollmentDate": "14-04-2025",
    "faceRegistered": false,
    "avatar": "RK",
    "feesPaid": 600,
    "fatherName": "Promod",
    "motherName": "Geeta"
  },
  {
    "id": "student-cscbv-hr4237-25-106",
    "admissionNo": "CSCBV-HR4237-25-106",
    "name": "Ranabir Das",
    "rollNo": 53,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "8826053280",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "RD",
    "feesPaid": 600,
    "fatherName": "Bidhan",
    "motherName": "Das"
  },
  {
    "id": "student-cscbv-hr4237-26-122",
    "admissionNo": "CSCBV-HR4237-26-122",
    "name": "Lakshina Khatun",
    "rollNo": 54,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "8207260500",
    "enrollmentDate": "02-12-2025",
    "faceRegistered": false,
    "avatar": "LK",
    "feesPaid": 400,
    "fatherName": "Antaj Ali",
    "motherName": "Lakki Bibi"
  },
  {
    "id": "student-cscbv-hr4237-25-85",
    "admissionNo": "CSCBV-HR4237-25-85",
    "name": "Pihu Das",
    "rollNo": 55,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9310148253",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "PD",
    "feesPaid": 600,
    "fatherName": "Mangal",
    "motherName": "Das"
  },
  {
    "id": "student-cscbv-hr4237-25-57",
    "admissionNo": "CSCBV-HR4237-25-57",
    "name": "Ashwani",
    "rollNo": 56,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9648437248",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "A",
    "feesPaid": 600,
    "fatherName": "Jiledar Verma",
    "motherName": "Sunita"
  },
  {
    "id": "student-cscbv-hr4237-25-41",
    "admissionNo": "CSCBV-HR4237-25-41",
    "name": "Rimika Sabnam",
    "rollNo": 57,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "6296232105",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "RS",
    "feesPaid": 800,
    "fatherName": "Enamul Alam",
    "motherName": "Asminara Khatun"
  },
  {
    "id": "student-cscbv-hr4237-25-44",
    "admissionNo": "CSCBV-HR4237-25-44",
    "name": "Sonali Das",
    "rollNo": 58,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "8130076462",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "SD",
    "feesPaid": 800,
    "fatherName": "Lakshman Das",
    "motherName": "Tumpa Roy"
  },
  {
    "id": "student-cscbv-hr4237-25-35",
    "admissionNo": "CSCBV-HR4237-25-35",
    "name": "Priyanka Yadav",
    "rollNo": 59,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "8130106950",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "PY",
    "feesPaid": 800,
    "fatherName": "Mr. Shatrudhan Yadav",
    "motherName": "Kajal Yadav"
  },
  {
    "id": "student-cscbv-hr4237-25-33",
    "admissionNo": "CSCBV-HR4237-25-33",
    "name": "Maya",
    "rollNo": 60,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "8376829125",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "M",
    "feesPaid": 0,
    "fatherName": "Mr. Krishn Kumar",
    "motherName": "Kamla Devi"
  },
  {
    "id": "student-cscbv-hr4237-25-32",
    "admissionNo": "CSCBV-HR4237-25-32",
    "name": "Jeet Das",
    "rollNo": 61,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9002343408",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "JD",
    "feesPaid": 1000,
    "fatherName": "Mr. Sukhen Das",
    "motherName": "Lalita Das"
  },
  {
    "id": "student-cscbv-hr4237-25-49",
    "admissionNo": "CSCBV-HR4237-25-49",
    "name": "Najiya Par",
    "rollNo": 62,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9871505241",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "NP",
    "feesPaid": 800,
    "fatherName": "Mr. Jasim",
    "motherName": "Khusbu Khatoon"
  },
  {
    "id": "student-cscbv-hr4237-25-43",
    "admissionNo": "CSCBV-HR4237-25-43",
    "name": "Shuhani Kumari",
    "rollNo": 63,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9654769623",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "SK",
    "feesPaid": 0,
    "fatherName": "Pinku Kumar Singh",
    "motherName": "Vibha Devi"
  },
  {
    "id": "student-cscbv-hr4237-25-36",
    "admissionNo": "CSCBV-HR4237-25-36",
    "name": "Rahima Khatun",
    "rollNo": 64,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "8377858176",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "RK",
    "feesPaid": 0,
    "fatherName": "Ramjan Sheikh",
    "motherName": "Manuara Bibi Khatun"
  },
  {
    "id": "student-cscbv-hr4237-25-31",
    "admissionNo": "CSCBV-HR4237-25-31",
    "name": "Chhanda Ruidas",
    "rollNo": 65,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "8810660685",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "CR",
    "feesPaid": 200,
    "fatherName": "Mr.Basuder Ruidas",
    "motherName": "Champa Rui Das"
  },
  {
    "id": "student-cscbv-hr4237-25-34",
    "admissionNo": "CSCBV-HR4237-25-34",
    "name": "Nandani Kumari",
    "rollNo": 66,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "8228946480",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "NK",
    "feesPaid": 400,
    "fatherName": "Mr. Bhogi Sahani",
    "motherName": "Lalita Devi"
  },
  {
    "id": "student-cscbv-hr4237-25-42",
    "admissionNo": "CSCBV-HR4237-25-42",
    "name": "Shi",
    "rollNo": 67,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9650025890",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "S",
    "feesPaid": 0,
    "fatherName": "Karan Dusad",
    "motherName": "Nandani Devi"
  },
  {
    "id": "student-cscbv-hr4237-25-30",
    "admissionNo": "CSCBV-HR4237-25-30",
    "name": "Bha",
    "rollNo": 68,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "8851075586",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "B",
    "feesPaid": 1000,
    "fatherName": "Mr.Hari Das",
    "motherName": "Laxmi Das"
  },
  {
    "id": "student-cscbv-hr4237-25-28",
    "admissionNo": "CSCBV-HR4237-25-28",
    "name": "Ankush Hazra",
    "rollNo": 69,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9749151912",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "AH",
    "feesPaid": 200,
    "fatherName": "Papai Hazra",
    "motherName": "Priyank Hazra"
  },
  {
    "id": "student-cscbv-hr4237-25-48",
    "admissionNo": "CSCBV-HR4237-25-48",
    "name": "Tanusree Mandol",
    "rollNo": 70,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "8918121263",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "TM",
    "feesPaid": 600,
    "fatherName": "Santosh Mandol",
    "motherName": "Sanchita Mandol"
  },
  {
    "id": "student-cscbv-hr4237-26-120",
    "admissionNo": "CSCBV-HR4237-26-120",
    "name": "Sanam Khatun",
    "rollNo": 71,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "7042343278",
    "enrollmentDate": "24-11-2025",
    "faceRegistered": false,
    "avatar": "SK",
    "feesPaid": 200,
    "fatherName": "Samraj Shaikh",
    "motherName": "Not Provided"
  },
  {
    "id": "student-cscbv-hr4237-25-76",
    "admissionNo": "CSCBV-HR4237-25-76",
    "name": "Keshav Kumar",
    "rollNo": 72,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "7836914354",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "KK",
    "feesPaid": 200,
    "fatherName": "Vijendra Pal",
    "motherName": "Anita Devi"
  },
  {
    "id": "student-cscbv-hr4237-25-60",
    "admissionNo": "CSCBV-HR4237-25-60",
    "name": "Aryan Harma",
    "rollNo": 73,
    "classId": "class-4a",
    "className": "Class IV-A",
    "grade": 4,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9717988171",
    "enrollmentDate": "29-09-2025",
    "faceRegistered": false,
    "avatar": "AH",
    "feesPaid": 400,
    "fatherName": "Arujan Sharma",
    "motherName": "Chandni Sharma"
  },
  {
    "id": "student-cscbv-hr4237-25-91",
    "admissionNo": "CSCBV-HR4237-25-91",
    "name": "Shikha Das",
    "rollNo": 74,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9355495528",
    "enrollmentDate": "07-04-2025",
    "faceRegistered": false,
    "avatar": "SD",
    "feesPaid": 400,
    "fatherName": "Biswajit Das",
    "motherName": "Anu Shree Das"
  },
  {
    "id": "student-cscbv-hr4237-25-83",
    "admissionNo": "CSCBV-HR4237-25-83",
    "name": "Saniya Sultana",
    "rollNo": 75,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "6290125568",
    "enrollmentDate": "03-04-2025",
    "faceRegistered": false,
    "avatar": "SS",
    "feesPaid": 0,
    "fatherName": "Mozaferrar Hossain",
    "motherName": "Dilruba Khatun"
  },
  {
    "id": "student-cscbv-hr4237-25-64",
    "admissionNo": "CSCBV-HR4237-25-64",
    "name": "Anchal Kumari",
    "rollNo": 76,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9334708605",
    "enrollmentDate": "29-09-2025",
    "faceRegistered": false,
    "avatar": "AK",
    "feesPaid": 1000,
    "fatherName": "Mahadev Mukhiya",
    "motherName": "Pinki Devi"
  },
  {
    "id": "student-cscbv-hr4237-25-53",
    "admissionNo": "CSCBV-HR4237-25-53",
    "name": "Anu Par",
    "rollNo": 77,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9205744689",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "AP",
    "feesPaid": 600,
    "fatherName": "Deerpal Singh",
    "motherName": "Mamta Khatun"
  },
  {
    "id": "student-cscbv-hr4237-25-118",
    "admissionNo": "CSCBV-HR4237-25-118",
    "name": "Himanshi Wiswakarma",
    "rollNo": 78,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "8595351990",
    "enrollmentDate": "10-07-2025",
    "faceRegistered": false,
    "avatar": "HW",
    "feesPaid": 0,
    "fatherName": "Shankar",
    "motherName": "Manisha Biswakarma"
  },
  {
    "id": "student-cscbv-hr4237-25-109",
    "admissionNo": "CSCBV-HR4237-25-109",
    "name": "Sahina Khatun",
    "rollNo": 79,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "7835984914",
    "enrollmentDate": "05-05-2025",
    "faceRegistered": false,
    "avatar": "SK",
    "feesPaid": 1000,
    "fatherName": "Jamsher Sekh",
    "motherName": "Ajmun Nahar Bibi"
  },
  {
    "id": "student-cscbv-hr4237-26-121",
    "admissionNo": "CSCBV-HR4237-26-121",
    "name": "Subhadip Das",
    "rollNo": 80,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "7047341931",
    "enrollmentDate": "24-11-2025",
    "faceRegistered": false,
    "avatar": "SD",
    "feesPaid": 200,
    "fatherName": "Tapas Das",
    "motherName": "Subhadra Das"
  },
  {
    "id": "student-cscbv-hr4237-25-96",
    "admissionNo": "CSCBV-HR4237-25-96",
    "name": "Sujan Rui Das",
    "rollNo": 81,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9382341476",
    "enrollmentDate": "07-04-2025",
    "faceRegistered": false,
    "avatar": "SR",
    "feesPaid": 0,
    "fatherName": "Lakshman Rui Das",
    "motherName": "Rupali Rui Das"
  },
  {
    "id": "student-cscbv-hr4237-25-92",
    "admissionNo": "CSCBV-HR4237-25-92",
    "name": "Shi",
    "rollNo": 82,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "8882156576",
    "enrollmentDate": "07-04-2025",
    "faceRegistered": false,
    "avatar": "S",
    "feesPaid": 400,
    "fatherName": "Ramu Tanti",
    "motherName": "Rinki Devi"
  },
  {
    "id": "student-cscbv-hr4237-25-87",
    "admissionNo": "CSCBV-HR4237-25-87",
    "name": "Sakibul Sk",
    "rollNo": 83,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9643557327",
    "enrollmentDate": "07-04-2025",
    "faceRegistered": false,
    "avatar": "SS",
    "feesPaid": 800,
    "fatherName": "Ajrul Sk",
    "motherName": "Taslima Bibi"
  },
  {
    "id": "student-cscbv-hr4237-25-78",
    "admissionNo": "CSCBV-HR4237-25-78",
    "name": "Rohit Sk",
    "rollNo": 84,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "8348795895",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "RS",
    "feesPaid": 400,
    "fatherName": "Kharul Sk",
    "motherName": "Munjira Bibi"
  },
  {
    "id": "student-cscbv-hr4237-25-56",
    "admissionNo": "CSCBV-HR4237-25-56",
    "name": "Anit Maity",
    "rollNo": 85,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "8743099006",
    "enrollmentDate": "01-04-2024",
    "faceRegistered": false,
    "avatar": "AM",
    "feesPaid": 600,
    "fatherName": "Arun Maity",
    "motherName": "Shrabani Maity"
  },
  {
    "id": "student-cscbv-hr4237-25-114",
    "admissionNo": "CSCBV-HR4237-25-114",
    "name": "Eshant Kumar Mandal",
    "rollNo": 86,
    "classId": "class-5a",
    "className": "Class V-A",
    "grade": 5,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9334954286",
    "enrollmentDate": "08-07-2025",
    "faceRegistered": false,
    "avatar": "EK",
    "feesPaid": 0,
    "fatherName": "Jay Kishor Mandal",
    "motherName": "Kavita Devi"
  },
  {
    "id": "student-cscbv-hr4237-26-128",
    "admissionNo": "CSCBV-HR4237-26-128",
    "name": "Mahira Khatun",
    "rollNo": 87,
    "classId": "class-ukg",
    "className": "UKG-A",
    "grade": 0.5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "7042343278",
    "enrollmentDate": "06-02-2026",
    "faceRegistered": false,
    "avatar": "MK",
    "feesPaid": 0,
    "fatherName": "Samaraj Shaikh",
    "motherName": "Pinki Bibi"
  },
  {
    "id": "student-cscbv-hr4237-26-124",
    "admissionNo": "CSCBV-HR4237-26-124",
    "name": "Ahana Hazra",
    "rollNo": 88,
    "classId": "class-ukg",
    "className": "UKG-A",
    "grade": 0.5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "8597829687",
    "enrollmentDate": "06-02-2026",
    "faceRegistered": false,
    "avatar": "AH",
    "feesPaid": 400,
    "fatherName": "Atish Hazra",
    "motherName": "Rupali Hazra"
  },
  {
    "id": "student-cscbv-hr4237-26-125",
    "admissionNo": "CSCBV-HR4237-26-125",
    "name": "Barsha Kumari",
    "rollNo": 89,
    "classId": "class-ukg",
    "className": "UKG-A",
    "grade": 0.5,
    "section": "A",
    "gender": "female",
    "schoolId": "school-001",
    "parentPhone": "9354784298",
    "enrollmentDate": "06-02-2026",
    "faceRegistered": false,
    "avatar": "BK",
    "feesPaid": 400,
    "fatherName": "Prabhat Kumar",
    "motherName": "Gunja Devi"
  },
  {
    "id": "student-cscbv-hr4237-26-129",
    "admissionNo": "CSCBV-HR4237-26-129",
    "name": "Shakib Ali",
    "rollNo": 90,
    "classId": "class-ukg",
    "className": "UKG-A",
    "grade": 0.5,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "8860338481",
    "enrollmentDate": "06-02-2026",
    "faceRegistered": false,
    "avatar": "SA",
    "feesPaid": 1000,
    "fatherName": "Shakib Ali",
    "motherName": "Lovely Khatun"
  },
  {
    "id": "student-cscbv-hr4237-26-123",
    "admissionNo": "CSCBV-HR4237-26-123",
    "name": "Ayan Sekh",
    "rollNo": 91,
    "classId": "class-ukg",
    "className": "UKG-A",
    "grade": 0.5,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9136240529",
    "enrollmentDate": "06-02-2026",
    "faceRegistered": false,
    "avatar": "AS",
    "feesPaid": 800,
    "fatherName": "Rejdani Sekh",
    "motherName": "Sarbanu Khatun"
  },
  {
    "id": "student-cscbv-hr4237-26-126",
    "admissionNo": "CSCBV-HR4237-26-126",
    "name": "Gourav",
    "rollNo": 92,
    "classId": "class-ukg",
    "className": "UKG-A",
    "grade": 0.5,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "8077952730",
    "enrollmentDate": "06-02-2026",
    "faceRegistered": false,
    "avatar": "G",
    "feesPaid": 200,
    "fatherName": "Devendra Kumar",
    "motherName": "Laltesh Kumari"
  },
  {
    "id": "student-cscbv-hr4237-25-6",
    "admissionNo": "CSCBV-HR4237-25-6",
    "name": "Dilkhush Kumar",
    "rollNo": 93,
    "classId": "class-ukg",
    "className": "UKG-A",
    "grade": 0.5,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "9341461862",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "DK",
    "feesPaid": 400,
    "fatherName": "Ramu Ram",
    "motherName": "Laxmi Devi"
  },
  {
    "id": "student-cscbv-hr4237-25-5",
    "admissionNo": "CSCBV-HR4237-25-5",
    "name": "Debabrata Bala",
    "rollNo": 94,
    "classId": "class-ukg",
    "className": "UKG-A",
    "grade": 0.5,
    "section": "A",
    "gender": "male",
    "schoolId": "school-001",
    "parentPhone": "8920903662",
    "enrollmentDate": "01-04-2025",
    "faceRegistered": false,
    "avatar": "DB",
    "feesPaid": 200,
    "fatherName": "Sanjit Bala",
    "motherName": "Dipa Bala"
  }
];

// ─── Generate Attendance Records (30 days) ─────────────────
const generateAttendanceRecords = () => {
  const records = [];
  const today = new Date();

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = subDays(today, dayOffset);
    const dayOfWeek = date.getDay();

    // Skip Sundays
    if (dayOfWeek === 0) continue;

    const dateStr = format(date, 'yyyy-MM-dd');

    demoStudents.forEach((student) => {
      // Simulate realistic attendance patterns
      const rand = Math.random();
      let status;

      if (dayOffset === 0) {
        // Today: slightly higher absence for realism
        if (rand < 0.88) status = ATTENDANCE_STATUS.PRESENT;
        else if (rand < 0.96) status = ATTENDANCE_STATUS.ABSENT;
        else status = ATTENDANCE_STATUS.LATE;
      } else {
        // Historical
        if (rand < 0.91) status = ATTENDANCE_STATUS.PRESENT;
        else if (rand < 0.97) status = ATTENDANCE_STATUS.ABSENT;
        else status = ATTENDANCE_STATUS.LATE;
      }

      const hour = 7;
      const minute = 45 + Math.floor(Math.random() * 25);
      const timestamp = new Date(date);
      timestamp.setHours(hour, minute, 0);

      records.push({
        id: `att-${dateStr}-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        classId: student.classId,
        className: student.className,
        schoolId: 'school-001',
        date: dateStr,
        status,
        method: Math.random() > 0.4 ? 'facial' : 'manual',
        confidence: status !== ATTENDANCE_STATUS.ABSENT ? (0.78 + Math.random() * 0.21).toFixed(2) : null,
        timestamp: timestamp.toISOString(),
        markedBy: 'teacher-ritika',
      });
    });
  }

  return records;
};

export const demoAttendanceRecords = generateAttendanceRecords();

// ─── Pre-calculated Stats for Dashboard ─────────────────────
const calculateDemoStats = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayRecords = demoAttendanceRecords.filter((r) => r.date === today);

  const totalEnrolled = demoStudents.length;
  const presentToday = todayRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
  const absentToday = todayRecords.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length;
  const lateToday = todayRecords.filter((r) => r.status === ATTENDANCE_STATUS.LATE).length;

  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const yesterdayRecords = demoAttendanceRecords.filter((r) => r.date === yesterday);
  const presentYesterday = yesterdayRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;

  // Class-wise stats for today
  const classStats = demoClasses.map((cls) => {
    const classStudents = demoStudents.filter((s) => s.classId === cls.id);
    const classRecords = todayRecords.filter((r) => r.classId === cls.id);
    const present = classRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
    const absent = classRecords.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length;
    const late = classRecords.filter((r) => r.status === ATTENDANCE_STATUS.LATE).length;
    const total = classStudents.length;
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100 * 10) / 10 : 0;

    return {
      classId: cls.id,
      className: cls.name === 'UKG' ? 'UKG-A' : `Class ${cls.name}-A`,
      teacherName: cls.teacherName,
      total,
      present,
      absent,
      late,
      percentage,
    };
  });

  // Trend data (last 14 days)
  const trendData = [];
  for (let i = 13; i >= 0; i--) {
    const date = subDays(new Date(), i);
    if (date.getDay() === 0) continue;
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayRecords = demoAttendanceRecords.filter((r) => r.date === dateStr);
    const dayPresent = dayRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
    const dayTotal = dayRecords.length;
    const pct = dayTotal > 0 ? Math.round((dayPresent / dayTotal) * 100 * 10) / 10 : 0;

    trendData.push({
      date: dateStr,
      label: format(date, 'dd MMM'),
      shortLabel: format(date, 'dd'),
      present: dayPresent,
      total: dayTotal,
      percentage: pct,
    });
  }

  // Weekly data
  const weeklyData = [];
  for (let w = 3; w >= 0; w--) {
    let weekPresent = 0;
    let weekTotal = 0;
    for (let d = 0; d < 7; d++) {
      const date = subDays(new Date(), w * 7 + d);
      if (date.getDay() === 0) continue;
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayRecords = demoAttendanceRecords.filter((r) => r.date === dateStr);
      weekPresent += dayRecords.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
      weekTotal += dayRecords.length;
    }
    weeklyData.push({
      label: `Week ${4 - w}`,
      present: weekPresent,
      total: weekTotal,
      percentage: weekTotal > 0 ? Math.round((weekPresent / weekTotal) * 100 * 10) / 10 : 0,
    });
  }

  return {
    totalEnrolled,
    presentToday,
    absentToday,
    lateToday,
    presentYesterday,
    attendancePercentage: totalEnrolled > 0 ? Math.round(((presentToday + lateToday) / totalEnrolled) * 100 * 10) / 10 : 0,
    classStats,
    trendData,
    weeklyData,
    todayRecords,
  };
};

export const demoStats = calculateDemoStats();

// ─── Demo Alerts ────────────────────────────────────────────
export const demoAlerts = [
  {
    id: 'alert-1',
    type: 'absence',
    severity: 'critical',
    message: 'Rohima Bashyal absent for 5 consecutive days',
    studentName: 'Rohima Bashyal',
    className: 'Class I-A',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: 'alert-2',
    type: 'low_attendance',
    severity: 'warning',
    message: 'Class UKG-A attendance dropped below 75% today',
    className: 'UKG-A',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: 'alert-3',
    type: 'absence',
    severity: 'warning',
    message: 'Anant Kumar absent for 3 consecutive days',
    studentName: 'Anant Kumar',
    className: 'Class I-A',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: 'alert-4',
    type: 'system',
    severity: 'info',
    message: 'Face recognition models loaded successfully',
    timestamp: subDays(new Date(), 1).toISOString(),
    read: true,
  },
];

// ─── Demo Meal Data ─────────────────────────────────────────
export const demoMealData = (() => {
  const meals = [];
  for (let i = 0; i < 14; i++) {
    const date = subDays(new Date(), i);
    if (date.getDay() === 0) continue;
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayRecords = demoAttendanceRecords.filter((r) => r.date === dateStr);
    const present = dayRecords.filter((r) => r.status !== ATTENDANCE_STATUS.ABSENT).length;

    meals.push({
      id: `meal-${dateStr}`,
      date: dateStr,
      dateLabel: format(date, 'dd MMM'),
      totalPresent: present,
      mealsServed: present - Math.floor(Math.random() * 5),
      estimatedQuantityKg: Math.round(present * 0.15 * 10) / 10,
      actualQuantityKg: Math.round(present * 0.15 * 10) / 10 + (Math.random() * 2 - 1),
      wastageKg: Math.round(Math.random() * 3 * 10) / 10,
      costPerMeal: 34.5,
    });
  }
  return meals;
})();

// ─── Demo Recent Activity ───────────────────────────────────
export const demoRecentActivity = [
  { id: 1, action: 'Attendance marked', detail: 'Class I-A (13 students)', user: 'Ritika', time: '08:15 AM', type: 'attendance' },
  { id: 2, action: 'Attendance marked', detail: 'Class II-A (18 students)', user: 'Gayatree Sahoo', time: '08:22 AM', type: 'attendance' },
  { id: 3, action: 'New student registered', detail: 'Rohima Bashyal added to Class I-A', user: 'Admin', time: '09:00 AM', type: 'student' },
  { id: 4, action: 'Report generated', detail: 'Weekly attendance report', user: 'Ms. Seema', time: '10:30 AM', type: 'report' },
  { id: 5, action: 'Alert triggered', detail: 'Low attendance in Class UKG-A', user: 'System', time: '11:00 AM', type: 'alert' },
];
