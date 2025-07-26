# 📱 KodeKloud Lite – React Native Assessment

This project is a simplified version of the KodeKloud mobile app built for a take-home assessment. It showcases core LMS features, clean architecture, and mobile-first optimizations.

---

## 🚀 Features

- 🔍 Browse Courses with Pagination
- 📘 Course Detail & Local Enrollment
- 🎥 Video Playback (Vimeo Embed)
- ✅ Track Lesson Completion & Course Progress
- 📦 Offline Caching
- 🔗 Deep Linking (`kodekloud://course/:id`)
- 🔔 Local Push Notification 24h after enrollment

---

## 🧱 Tech Stack

- **React Native** 0.77 (TypeScript)
- **Redux Toolkit** for State Management
- **Realm DB** for Offline Support
- **React Navigation v6** with Deep Linking
- **Axios** for Networking
- **react-native-push-notification** for Local Notifications
- **Jest** for Unit Testing
- **GitHub Actions** for CI

---

## 🧭 Deep Linking

| Link | Navigates to |
|------|---------------|
| `kodekloud://courses` | Course List |
| `kodekloud://course/:courseId` | Course Detail |
| `kodekloud://course/:courseId/lesson/:lessonId` | Lesson Detail |

---

## 🔔 Push Notification

After enrolling in a course, the app schedules a local notification to remind the user to start within 24 hours.

```ts
scheduleCourseReminder("Docker for Beginners");
```

---

## 🛠 Setup Instructions

```bash
git clone https://github.com/codecrafted/KodeKloudLite.git
cd KodeKloudLite
npm install
npx react-native run-android # or run-ios
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
