import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/session';
import Generator from './Generator';

export default async function Home() {
  if (!(await isAuthenticated())) {
    redirect('/login');
  }
  return <Generator />;
}
