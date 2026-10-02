import { redirect } from 'next/navigation';
import { PROJECTS_PATH } from '@/config/routes';

export default function HomePage() {
  redirect(PROJECTS_PATH);
}
