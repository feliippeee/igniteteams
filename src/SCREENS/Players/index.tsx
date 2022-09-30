import { useEffect, useState, useRef } from 'react';
import { Alert, FlatList, TextInput, Keyboard } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam';
import { PlayerStorageDTO } from '@storage/player/playerStorageDTO';
import { PlayerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { AppError } from '@utils/AppError';

import { Input } from '@components/Input';
import { ButtonIcon } from '@components/ButtonIcon';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Filter } from '@components/Filter';
import { PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';

import { Container, Form, HeaderList, NumberOfPlayers } from './styles';

type RouteParams = {
    group: string;
}

export function Players() {
    const [ newPlayerName, setNewPlayerName ] = useState('');
    const [team, setTeam ] = useState('Time A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

    const route = useRoute();
    const { group } = route.params as RouteParams;

    const newPlayerNameInputRef = useRef<TextInput>(null);

    async function handleAddPlayer() {
        if(newPlayerName.trim().length === 0) {
            return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar.');
        }
        const newPlayer = {
            name : newPlayerName,
            team,
        }

        try {
            await playerAddByGroup(newPlayer, group);

            newPlayerNameInputRef.current?.blur(); // tira o cursor do input
            //Keyboard.dismiss(); 

            setNewPlayerName('')
            fetchPlayersByTeam();

        }catch(error) {
            if(error instanceof AppError) {
                Alert.alert('Nova pessoa', error.message);
            }else{
                console.log(error);
                Alert.alert('Nova pessoa', 'Não foi possível adicionar');
            }
        }
    }
    
    async function fetchPlayersByTeam() {
        try {
            const playersByTeam = await playersGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
        }catch(error){
            console.log(error);
            Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado');
        }
    }

    async function handleRemovePlayer(playerName: string){
        try{
            await PlayerRemoveByGroup(playerName, group);
            fetchPlayersByTeam();
        }catch(error) {
            console.log(error);
            Alert.alert('Remover Pessoas', 'Não foi possível remover essa pessoa.')
        }
    }

    useEffect(() => {
        fetchPlayersByTeam();
    }, [team]);

    return (
        <Container>
            <Header showBackButton />

            <Highlight 
                title={group}
                subtitle='adicione a galera e separe os times'
            />
            <Form>
                <Input 
                    inputRef={newPlayerNameInputRef}
                    onChangeText={setNewPlayerName}
                    value={newPlayerName}
                    placeholder='Nome da pessoa'
                    autoCorrect={false}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType='done'
                />
                
                <ButtonIcon 
                    icon="add" 
                    onPress={handleAddPlayer}
                />
            </Form>
            <HeaderList>

                <FlatList 
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter  
                        title={item}
                        isActive={item === team}
                        onPress={() => setTeam(item)}
                        />
                        )}
                        horizontal
                />

                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>

            <FlatList 
                data={players}
                keyExtractor={item => item.name}
                renderItem={({item}) => (
                    <PlayerCard 
                        name={item.name}
                        onRemove={() => handleRemovePlayer(item.name)}
                    />
                )}
                ListEmptyComponent={() => (
                    <ListEmpty 
                      message="Não há pessoas nesse time"
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[ { paddingBottom: 100}, players.length === 0 && { flex: 1}
                ]}
            />

            <Button 
                title="Remover turma"
                type="SECONDARY"
            />

        </Container>
    )
}