import { Agentation } from 'agentation';

const AGENTATION_ENDPOINT = 'http://localhost:4747';

/** Dev-only visual feedback toolbar; syncs to agentation-mcp on port 4747. */
export function AgentationDev() {
  if (process.env.NODE_ENV !== 'development') return null;

  return <Agentation endpoint={AGENTATION_ENDPOINT} />;
}
