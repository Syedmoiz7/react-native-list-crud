import React, { useState, useEffect, JSX } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ListRenderItem,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Item {
  id: string;
  title: string;
  description: string;
}

export default function App(): JSX.Element {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isShowValidationForTitle, setIsShowValidationForTitle] = useState<boolean>(false);
  const [isShowValidationForDescription, setIsShowValidationForDescription] = useState<boolean>(false);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    saveItems();
  }, [items]);

  const loadItems = async (): Promise<void> => {
    try {
      const storedItems = await AsyncStorage.getItem('items');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (e) {
      console.error('Failed to load items.', e);
    }
  };

  const saveItems = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem('items', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save items.', e);
    }
  };

  const setTitleValue = (val: string): void => {
    if (isShowValidationForTitle) {
      setIsShowValidationForTitle(false)
    }
    setTitle(val)
  };

  const setDescriptionValue = (val: string): void => {
    if (isShowValidationForDescription) {
      setIsShowValidationForDescription(false)
    }
    setDescription(val)
  };

  const addItem = (): void => {
    if (!title.trim()) {
      setIsShowValidationForTitle(true)
      return
    } else if (!description.trim()) {
      setIsShowValidationForDescription(true)
      return
    }
    const newItem: Item = { id: Date.now().toString(), title, description };
    setItems([...items, newItem]);
    setTitle('');
    setDescription('');
  };

  const deleteItem = (id: string): void => {
    setItems(items.filter((item) => item.id !== id));
  };

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text>{item.description}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteItem(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.heading}>Items List</Text>
      <View>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={(val) => setTitleValue(val)}
          style={styles.input}
        />
        {isShowValidationForTitle && <Text style={styles.validationText}>Title should not be empty</Text>}
      </View>
      <View>
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={(val) => setDescriptionValue(val)}
          style={styles.input}
        />
        {isShowValidationForDescription && <Text style={styles.validationText}>Description should not be empty</Text>}
      </View>
      <Button title="Add Item" onPress={addItem} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => <Text style={styles.noItems}>No items yet.</Text>}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  list: {
    marginTop: 20,
  },
  itemContainer: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteText: {
    color: 'red',
  },
  noItems: {
    // color: 'red',
    textAlign: 'center',
  },
  validationText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginTop: -5,
  },
});
