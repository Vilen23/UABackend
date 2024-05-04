import express from 'express';
import cors from 'cors'
import Authentication from './routes/Authentication';

const app = express();
app.use(express.json());
app.use(cors())

app.use('/api/auth',Authentication);


app.listen(8000, () => {
  console.log('Server is running on port 8000');
});