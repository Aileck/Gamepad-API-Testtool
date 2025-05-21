declare module '*.svg?component' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare module '*.svg?url' {
  const url: string
  export default url
}

declare module '*.svg?raw' {
  const raw: string
  export default raw
}