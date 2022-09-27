import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

export type ButtonTypeStyleProps = 'PRIMARY' | 'SECONDARY';

type Props = TouchableOpacity & {
    type: ButtonTypeStyleProps;
}

export const Container = styled.TouchableOpacity<Props>`
    width: 56px;
    height: 56px;

    justify-content: center;
    align-items: center;
    border-radius: 12px;
`;

export const Icon = styled(MaterialIcons).attrs<Props>(({theme, type}) => ({
    size: 24,
    color: type === 'PRIMARY' ? theme.COLORS.GREEN_700 : theme.COLORS.RED
}))``