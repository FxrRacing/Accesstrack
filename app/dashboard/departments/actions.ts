'use server'



export async function createDepartment(prevState: {message: string}, formData: FormData) {
    const name = formData.get('name')
    const description = formData.get('description')
    if (!name || !description) {
        return {message: 'Please fill in all fields'}
    }
   
    return {message: 'Department created successfully'}
}