'use server';
export async function formSubmit(form: FormData) {
  console.log('data received');
  console.log(Array.from(form.entries()));
}
