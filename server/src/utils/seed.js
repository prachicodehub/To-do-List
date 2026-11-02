// Seeds demo tasks across the previous, current and next week: `npm run seed`
import Task from '../models/Task.js';
import { connectDB, disconnectDB } from '../config/db.js';

const at = (dayOffset, hour, min = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, min, 0, 0);
  return d;
};

const demo = [
  { title: 'Finishing Wireframe', description: 'Home + search screens', dueAt: at(0, 10), priority: 'high' },
  { title: 'Meeting with team', description: 'Sprint planning', dueAt: at(0, 14), endAt: at(0, 15), priority: 'medium' },
  { title: 'Buy a cat food', dueAt: at(0, 18), status: 'completed', priority: 'low' },
  { title: 'Finishing daily commission', dueAt: at(0, 20), status: 'completed' },
  { title: 'Doing Homework', description: 'Maths chapter 4', dueAt: at(1, 17), priority: 'medium' },
  { title: 'Gym session', dueAt: at(2, 7), priority: 'low' },
  { title: 'Review pull requests', dueAt: at(-7, 11), status: 'completed', priority: 'high' },
  { title: 'Pay electricity bill', dueAt: at(-6, 9), status: 'completed' },
  { title: 'Plan weekend trip', dueAt: at(-5, 19) },
  { title: 'Dentist appointment', dueAt: at(7, 16), priority: 'high' },
];

await connectDB();
await Task.deleteMany({});
for (const t of demo) await Task.create(t);
console.log(`Seeded ${demo.length} tasks`);
await disconnectDB();
