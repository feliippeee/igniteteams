import { Header } from '@components/Header';
import { GroupCard } from '@components/GroupCard';

import { Highlight } from '@components/Highlight';
import { Container } from './styles';

export function Groups() {
  return (
    <Container>
      <Header />
      <Highlight 
        title="Turmas"
        subtitle="Jogue com sua turma"
      />
      <GroupCard 
        title="Galera do Ignite"
        
      />
    </Container>
  );
}