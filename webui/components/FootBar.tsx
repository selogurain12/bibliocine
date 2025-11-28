import { View } from 'react-native';
import { BookOpen, Film, Library } from 'lucide-react-native';
import { Button } from './ui/button';
import { Text } from './ui/text';
import { useNavigation } from '@react-navigation/native';

export function FootBar() {
  const navigation = useNavigation();
  return (
    <View className="h-16 flex-row bg-amber-100 justify-center items-center border-t border-gray-200">
      <View className="w-1/3 flex-row justify-center">
        <Button className="flex-col items-center gap-1" variant="ghost">
          <Film size={20} />
          <Text className="text-xs">Films</Text>
        </Button>
      </View>
      <View className="w-1/3 flex-row justify-center">
        <Button className="flex-col items-center gap-1" variant="ghost" onPress={() => navigation.navigate('Book')}>
          <BookOpen size={20} />
          <Text className="text-xs">Livres</Text>
        </Button>
      </View>
      <View className="w-1/3 flex-row justify-center">
        <Button className="flex-col items-center gap-1" variant="ghost">
          <Library size={20} />
          <Text className="text-xs">Collections</Text>
        </Button>
      </View>
    </View>
  );
}
