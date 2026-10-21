# Explorer App React

Esta es mi primera migración de Explorer App a React. La tarjeta recibe un país por props y se reutiliza con tres datos locales.

## Tecnologías

- React 18 y React DOM 18
- Vite y TypeScript
- Tailwind CSS v4
- pnpm

## Requisitos y comandos

Se recomienda Node.js 22.12 o posterior dentro de la versión 22, además de pnpm.

```sh
pnpm install
pnpm dev
```

Para comprobar la compilación:

```sh
pnpm build
```

## Captura

![Explorer App con tres tarjetas de países](public/captura-explorer.png)

## Componentes y datos

- `src/App.tsx` combina `Header` y `CountryGrid`, entrega el arreglo local y define la acción de selección.
- `src/components/atoms/Badge.tsx` muestra la región y `src/components/atoms/Flag.tsx` muestra la bandera.
- `src/components/molecules/CountryCard.tsx` recibe `country: Country` y `onSelect`; combina `Flag` y `Badge`.
- `src/components/organisms/CountryGrid.tsx` recibe `countries: Country[]` y `onSelect`, y crea una tarjeta por país con `map()` y una key basada en `cca2`.
- `src/components/organisms/Header.tsx` recibe contenido mediante `children`.
- `src/types/country.ts` conserva el contrato de país de la versión Vanilla TypeScript.
- `src/utils/format.ts` conserva `formatPopulation`, que agrupa la población usando la configuración regional `es-SV`.
- `src/data/countries-demo.ts` guarda cuatro ejemplos con el tipo `Country`.

## Lo que aprendí

1. Antes la tarjeta generaba HTML y se insertaba manualmente en el DOM. Ahora `CountryCard` devuelve JSX y React la representa.
2. El componente recibe un objeto `country`, tipado como `Country` en su interfaz de props.
3. Reutilicé el tipo `Country` y `formatPopulation` de Vanilla TypeScript para mantener la forma de los datos y no repetir el formato de población.
4. Comprobé que `CountryGrid` recibe el arreglo y entrega cada país y la acción a una tarjeta. La key usa el código estable `cca2`.
5. `country` lleva los datos; `onSelect` lleva una función que se ejecuta al pulsar el botón. `Header` recibe su contenido como `children`.
6. Agregué México al arreglo y apareció sin escribir otra tarjeta en `App`. La búsqueda reactiva y la carga con fetch quedan para las siguientes sesiones.
