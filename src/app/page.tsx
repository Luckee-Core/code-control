import { redirect } from 'next/navigation';
import { DASHBOARD_PATH } from '@/config/routes';

export default function HomePage() {
  redirect(DASHBOARD_PATH);
}
