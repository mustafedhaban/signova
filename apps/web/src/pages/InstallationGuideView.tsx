import { Navigate, useParams } from 'react-router-dom';

/** Legacy `/guides/:guideId` URLs → tabbed `/guides?tab=…` */
const LEGACY_TAB_MAP: Record<string, string> = {
  gmail: 'gmail',
  'outlook-desktop': 'outlook',
  'outlook-web': 'outlook',
  'apple-mail': 'apple-mail',
  mobile: 'html',
};

const InstallationGuideView: React.FC = () => {
  const { guideId } = useParams<{ guideId: string }>();
  const tab = (guideId && LEGACY_TAB_MAP[guideId]) || 'gmail';
  return <Navigate to={`/guides?tab=${tab}`} replace />;
};

export default InstallationGuideView;
