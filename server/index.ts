import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 IRON REVOLUTION Server running at http://localhost:${PORT}`);
  console.log(`📍 Location: Naroli, Silvassa, Dadra and Nagar Haveli - 396235`);
  console.log(`🏋️ Owner: Sachin Patel | Developer: Apurva Mishra`);
  console.log(`======================================================\n`);
});
