import { defineStore } from 'pinia';
import { collection, doc, getDocs, getFirestore, query, orderBy, addDoc, deleteDoc } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import { Timestamp } from 'firebase/firestore';

export interface ITimeLogEntry {
  taskName: string;
  date: Date;
  minutes: number;
  id: string;
}

export const useFirestore = defineStore('firestore', () => {
  const db = getFirestore();

  const taskList = ref<string[]>([]);
  const timeEntries = ref<ITimeLogEntry[]>([]);

  async function addLogEntry(taskName: string, date: Date, minutes: number) {
    const data = {
      taskName,
      date,
      minutes,
      id: '',
    };
    const docRef = await addDoc(collection(db, 'tasks'), data);
    // @ts-ignore
    data.date = Timestamp.fromDate(date);
    data.id = docRef.id;
    timeEntries.value.push(data);
  }

  async function getTaskListFromDb() {
    taskList.value = [];
    timeEntries.value = [];
    const q = query(collection(db, 'tasks'), orderBy('taskName'));
    const qs = await getDocs(q);
    qs.forEach(doc => {
      const data = doc.data() as ITimeLogEntry;
      data.id = doc.id;
      if (taskList.value.indexOf(data.taskName) === -1) {
        taskList.value.push(data.taskName);
      }
      timeEntries.value.push(data);
    });
  }

  async function deleteEntries() {
    timeEntries.value.forEach(entry => {
      deleteDoc(doc(db, 'tasks', entry.id));
    });
    timeEntries.value = [];
  }

  onMounted(() => {
    getTaskListFromDb();
  });

  return {
    addLogEntry,
    taskList,
    timeEntries,
    deleteEntries,
  };
});
