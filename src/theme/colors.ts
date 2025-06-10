// Utilitários de cores para TypeScript/JavaScript

// Tipos para as cores
type ColorShade = 'base' | 'light' | 'lighter' | 'dark' | 'darker' | 'contrast';
type ColorCategory = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';

// Interface para o objeto de cores
interface ColorPalette {
  [key: string]: {
    [key: string]: string;
  };
}

// Cores base (deve corresponder ao _base.scss)
const colors: ColorPalette = {
  primary: {
    base: '#1E3A8A',
    light: '#3B82F6',
    lighter: '#93C5FD',
    dark: '#1A3379',
    darker: '#0F1A4D',
    contrast: '#FFFFFF'
  },
  success: {
    base: '#10B981',
    light: '#34D399',
    lighter: '#A7F3D0',
    dark: '#059669',
    darker: '#047857',
    contrast: '#FFFFFF'
  },
  warning: {
    base: '#F59E0B',
    light: '#FBBF24',
    lighter: '#FDE68A',
    dark: '#D97706',
    darker: '#B45309',
    contrast: '#1F2937'
  },
  danger: {
    base: '#EF4444',
    light: '#F87171',
    lighter: '#FECACA',
    dark: '#DC2626',
    darker: '#B91C1C',
    contrast: '#FFFFFF'
  },
  neutral: {
    white: '#FFFFFF',
    lightest: '#F9FAFB',
    lighter: '#F3F4F6',
    light: '#E5E7EB',
    base: '#9CA3AF',
    dark: '#6B7280',
    darker: '#4B5563',
    darkest: '#1F2937',
    black: '#111827'
  }
};

/**
 * Obtém uma cor específica da paleta
 * @param category Categoria da cor (primary, success, warning, etc.)
 * @param shade Tom da cor (base, light, dark, etc.)
 * @returns Valor hexadecimal da cor
 */
export function getColor(category: ColorCategory, shade: ColorShade | string = 'base'): string {
  return colors[category]?.[shade] || colors["neutral"]["base"];
}

/**
 * Obtém uma cor com opacidade específica
 * @param category Categoria da cor
 * @param shade Tom da cor
 * @param opacity Opacidade (0-1)
 * @returns Cor no formato rgba
 */
export function getColorWithOpacity(
  category: ColorCategory, 
  shade: ColorShade | string = 'base', 
  opacity: number = 1
): string {
  const hex = getColor(category, shade).replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Obtém a cor de contraste adequada para um fundo específico
 * @param category Categoria da cor de fundo
 * @param shade Tom da cor de fundo
 * @returns Cor de contraste (branco ou preto)
 */
export function getContrastColor(
  category: ColorCategory, 
  shade: ColorShade | string = 'base'
): string {
  // Se a cor tiver um contraste definido, use-o
  if (colors[category]?.["contrast"]) {
    return colors[category]["contrast"];
  }
  
  // Caso contrário, calcule o contraste com base no brilho
  const hex = getColor(category, shade).replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Fórmula de luminosidade relativa
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Retorna preto para fundos claros e branco para fundos escuros
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

/**
 * Obtém a paleta de cores completa
 * @returns Objeto com todas as cores
 */
export function getColorPalette(): ColorPalette {
  return colors;
}

/**
 * Obtém as cores de uma categoria específica
 * @param category Categoria das cores
 * @returns Objeto com as cores da categoria
 */
export function getColorCategory(category: ColorCategory): { [key: string]: string } {
  return colors[category] || {};
}

// Exporta as cores como um objeto padrão
export default colors;
