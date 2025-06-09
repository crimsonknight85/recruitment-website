import axios from 'axios';

export async function uploadResumeToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'resume_unsigned'); // use your unsigned preset name

  const res = await axios.post(
    'https://api.cloudinary.com/v1_1/da0y3ha2x/raw/upload',
    formData
  );

  return res.data.secure_url;
}
