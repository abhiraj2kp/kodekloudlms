# 📱 KodeKloud LMS – React Native Assessment

This project is a simplified version of the KodeKloud mobile app built for a take-home assessment. It showcases core LMS features, clean architecture, and mobile-first optimizations.

---

## 🚀 Features

- 🔍 Browse Courses with Pagination
- 📘 Course Detail & Local Enrollment
- 🎥 Video Playback (Vimeo Embed)
- ✅ Track Lesson Completion & Course Progress
- 📦 Offline Caching
- 🔗 Deep Linking (`kodekloud://`)

---

## 🧱 Tech Stack

- **React Native** 0.80.1 (TypeScript)
- **Redux Toolkit** for State Management
- **MMKV DB** for Offline Support
- **React Navigation v7** with Deep Linking
- **Axios** for Networking
- **GitHub Actions** for CI

---

## 🧭 Deep Linking

| Link | Navigates to |
|------|---------------|
| `kodekloud://courses` | Course List |
| `kodekloud://course/:courseId` | Course Detail |
| `kodekloud://course/:courseId/lesson/:lessonId` | Lesson Detail |
- **ex: kodekloud://course/crash-course-kubernetes-for-absolute-beginners/lesson/81ed63bb-1556-4723-857b-99b4fcda7c20**
---

## 🛠 Setup Instructions

```bash
git clone https://github.com/abhiraj2kp/kodekloudlms
cd kodekloudlms
npm install
npx react-native run-ios  or run-android
```


## 📁 Folder Structure (src/)

```
App.tsx
src/
├── data/
├── ui/
├── units/
```

---

## 👤 Author

**Abhishek**  
Sr. React Native Engineer 

---

## ✅ Notes

- `node_modules` excluded from the ZIP
- Ready to build and run directly
