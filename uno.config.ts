import { defineConfig, presetIcons, presetUno, presetTypography } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetIcons(), presetTypography()],
  shortcuts: {
    'slide-callout': 'bg-primary/10 border-l-4 border-primary pl-4 py-2 rounded-md',
  },
  theme: {
    colors: {
      primary: '#5E4CE6',
      danger: '#FF6B6B',
    },
  },
})
