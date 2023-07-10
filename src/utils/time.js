import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

export const time = [
  { id: "null", t: "Select" },
  { id: "6", t: "6:00am" },
  { id: "7", t: "7:00am" },
  { id: "8", t: "8:00am" },
  { id: "9", t: "9:00am" },
  { id: "10", t: "10:00am" },
  { id: "11", t: "11:00am" },
  { id: "12", t: "12:00pm" },
  { id: "13", t: "1:00pm" },
  { id: "14", t: "2:00pm" },
  { id: "15", t: "3:00pm" },
  { id: "16", t: "4:00pm" },
  { id: "17", t: "5:00pm" },
  { id: "18", t: "6:00pm" },
  { id: "19", t: "7:00pm" },
  { id: "20", t: "8:00pm" },
  { id: "21", t: "9:00pm" },
  { id: "22", t: "10:00pm" },
];

export async function handleCreateAvailability(availability) {
  try {
    await fetch(PUBLIC_BACKEND_BASE_URL + "/availability", {
      method: "POST",
      body: JSON.stringify({
        //providerId: localStorage.getItem("providerId"),
        availability,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error(err);
  }
};