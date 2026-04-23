import bcrypt from 'bcryptjs';

const hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/MFS';
const isMatch = bcrypt.compareSync('admin123', hash);
console.log('Matches admin123?', isMatch);

const isMatch2 = bcrypt.compareSync('ChangeMe123!', hash);
console.log('Matches ChangeMe123!?', isMatch2);
