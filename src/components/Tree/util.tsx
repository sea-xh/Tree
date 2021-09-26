//@ts-nocheck
export function arrDel(list: [], value) {
  const clone = list.slice();
  const index = clone.indexOf(value);
  if (index >= 0) {
    clone.splice(index, 1);
  }
  return clone;
}

export function arrAdd(list, value) {
  const clone = list.slice();
  if (clone.indexOf(value) === -1) {
    clone.push(value);
  }
  return clone;
}

export function getPosition(level: string | number, index: number) {
  return `${level}-${index}`;
}

export function getDataAndAria(props) {
  const omitProps = {};
  Object.keys(props).forEach((key) => {
    if (key.startsWith('data-') || key.startsWith('aria-')) {
      omitProps[key] = props[key];
    }
  });

  return omitProps;
}
