// @flow

import { createStore, createEvent } from 'effector';
import type { Store } from 'effector';

// Create store map

// eslint-disable-next-line arrow-parens
export const createStoreMap = <K, V, Item>(
  $items: Store<Array<Item>>,
  config: {
    getKey: (item: Item) => K,
    createValue: (item: Item) => V,
    getStore: (value: V) => Store<Item>,
    fullSync: boolean,
    onDelete?: (key: K, value: V, Store<Item>) => void,
  },
): Store<Map<K, V>> => {
  const {
    getKey,
    createValue,
    getStore,
    fullSync,
    onDelete,
  } = config;

  // Check config
  if (getKey === undefined) throw new Error('getKey is required');
  if (createValue === undefined) throw new Error('createValue is required');
  if (getStore === undefined) throw new Error('getStore is required');
  if (fullSync === undefined) throw new Error('fullSync is required');

  const replaceItem = (items, newItem) => items.map(
    item => (getKey(item) === getKey(newItem) ? newItem : item),
  );

  // Create storeMap with items
  const $storeMap: Store<Map<K, V>> = createStore(
    $items.getState().reduce((result, item) => {
      const newValue = createValue(item);
      $items.on(getStore(newValue), replaceItem);
      return result.set(getKey(item), newValue);
    }, new Map()),
  );

  // Watch items
  $storeMap.on($items, (storeMap, items) => {
    let shouldNotify = false;

    // Check for new items and update
    const itemsMap = items.reduce((result, item) => {
      const key = getKey(item);
      const value = storeMap.get(key);

      if (value === undefined) {
        // Add entry
        const newValue = createValue(item);
        $items.on(getStore(newValue), replaceItem);
        storeMap.set(key, newValue);
        shouldNotify = true;
      } else {
        // Update entry
        const setState = createEvent('set state');
        getStore(value).on(setState, (state, newState) => {
          if (fullSync && state !== newState) {
            shouldNotify = true;
          }
          return newState;
        });
        setState(item);
      }

      return result.set(key, item);
    }, new Map());

    // Check for deleted items
    for (const [key, value] of storeMap) {
      if (!itemsMap.has(key)) {
        // Delete entry
        const store = getStore(value);
        $items.off(store);
        if (onDelete !== undefined) {
          onDelete(key, value, store);
        }
        storeMap.delete(key);
        shouldNotify = true;
      }
    }

    if (itemsMap.size !== storeMap.size) {
      throw new Error('sizes are not equal');
    }

    // Check if order is changed
    const itemsMapKeys: Array<K> = Array.from(itemsMap.keys());
    const storeMapKeys: Array<K> = Array.from(storeMap.keys());
    const disordered = storeMapKeys.some((key, index) => key !== itemsMapKeys[index]);

    // Restore order
    if (disordered) {
      const newStoreMap = new Map();

      for (const [key] of itemsMap) {
        const value = storeMap.get(key);
        if (value === undefined) {
          throw new Error('value is not found');
        }
        newStoreMap.set(key, value);
      }

      return newStoreMap;
    }

    return shouldNotify ? new Map(storeMap) : storeMap;
  });

  return $storeMap;
};

// Create mapper

type MapFn<I, P> = (todo: I, payload: P) => I
export type Mapper<A, P> = (todos: A, payload: P) => A

export const createMapper = <I, P>(mapFn: MapFn<I, P>): Mapper<Array<I>, P> => (
  items: Array<I>,
  payload: P,
): Array<I> => {
  let shouldUpdate = false;
  const newItems: Array<I> = items.map((item: I) => {
    const newItem = mapFn(item, payload);
    if (newItem !== item) {
      shouldUpdate = true;
    }
    return newItem;
  });
  return shouldUpdate ? newItems : items;
};
