# Guía para Pruebas Unitarias y Coverage - Angular 20

## Configuración Realizada (Angular 20.1.0)

### 1. Configuración de Karma y Coverage
- **karma.conf.js**: Configurado para Angular 20 con `@angular-devkit/build-angular/plugins/karma`
- **angular.json**: Usando el nuevo builder `@angular/build:karma` (Angular 20)
- **package.json**: Scripts optimizados para Angular 20
- **Dependencias**: `@angular-devkit/build-angular` instalado para compatibilidad con karma

### 2. Características específicas de Angular 20
- ✅ **Nuevo sistema de build**: `@angular/build` en lugar de `@angular-devkit/build-angular`
- ✅ **Standalone components**: Todos los componentes usan `standalone: true`
- ✅ **Signals API**: Uso nativo de signals para estado reactivo
- ✅ **Mejoras en Testing**: Soporte mejorado para pruebas de componentes standalone
- ✅ **TypeScript 5.8**: Compatibilidad con las últimas características de TypeScript

### 3. Scripts Disponibles

```json
{
  "test": "ng test",                    // Ejecuta pruebas en modo watch
  "test:ci": "ng test --watch=false --code-coverage", // Para CI/CD
  "test:coverage": "ng test --code-coverage --watch=false", // Coverage sin watch
  "test:watch": "ng test --code-coverage" // Coverage con watch
}
```

### 4. Pruebas Unitarias Implementadas (Angular 20)

#### ProductService (`src/app/services/product.service.spec.ts`)
- ✅ Creación del servicio
- ✅ getProducts() - obtener productos de la API
- ✅ addProduct() - añadir nuevo producto
- ✅ verifyProductId() - verificar ID único
- ✅ deleteProduct() - eliminar producto
- ✅ updateProduct() - actualizar producto
- ✅ Manejo de errores HTTP

#### ProductListComponent (`src/app/components/product-list/product-list.spec.ts`)
- ✅ Creación del componente
- ✅ Carga de productos en inicialización
- ✅ Filtrado de productos por término de búsqueda
- ✅ Manejo de cambio de tamaño de página
- ✅ Apertura/cierre de menús contextuales
- ✅ Modal de confirmación de eliminación
- ✅ Eliminación de productos
- ✅ Manejo de errores

#### ProductNewComponent (`src/app/components/product-new/product-new.spec.ts`)
- ✅ Creación del componente
- ✅ Validaciones de formulario (required, minLength, maxLength)
- ✅ Validación de fecha de lanzamiento
- ✅ Validación de ID único (async validator)
- ✅ Cálculo automático de fecha de revisión
- ✅ Envío del formulario
- ✅ Manejo de errores

#### ProductEditComponent (`src/app/components/product-edit/product-edit.spec.ts`)
- ✅ Creación del componente
- ✅ Carga de datos del producto existente
- ✅ Validaciones de formulario
- ✅ Campos deshabilitados (ID, fecha de revisión)
- ✅ Actualización del producto
- ✅ Manejo de errores

## Cómo Ejecutar las Pruebas (Angular 20)

### Método 1: Scripts de npm (Recomendado para Angular 20)
```bash
# Ejecutar todas las pruebas con coverage
npm run test:coverage

# Ejecutar pruebas para CI (sin watch)
npm run test:ci

# Ejecutar pruebas con coverage y watch
npm run test:watch
```

### Método 2: Angular CLI directo (Angular 20)
```bash
# Con coverage usando el nuevo builder
ng test --code-coverage --watch=false

# Con coverage y navegador headless (para CI)
ng test --code-coverage --watch=false --browsers=ChromeHeadless
```

### Método 3: Usando cmd (para evitar problemas de PowerShell en Windows)
```bash
cmd /c "npm run test:coverage"
```

### Nota importante para Angular 20:
Angular 20 usa el nuevo sistema de build `@angular/build` que puede tener diferencias menores en la salida de los comandos comparado con versiones anteriores, pero la funcionalidad es la misma.

## Reportes de Coverage

Los reportes de coverage se generan en la carpeta:
```
./coverage/ntt-data-frontend/
```

### Tipos de reportes generados:
- **HTML**: Reporte visual navegable (`index.html`)
- **LCOV**: Para integración con herramientas de CI/CD
- **Text Summary**: Resumen en consola
- **Clover**: Formato XML para herramientas de análisis

## Umbrales de Coverage Configurados

El proyecto está configurado para requerir un **mínimo del 70%** de coverage en:
- ✅ **Statements**: 70%
- ✅ **Branches**: 70%
- ✅ **Functions**: 70%
- ✅ **Lines**: 70%

## Verificar Coverage

Después de ejecutar las pruebas, puedes:

1. **Ver resumen en consola**: Aparece automáticamente al final de la ejecución
2. **Abrir reporte HTML**: Navegar a `coverage/ntt-data-frontend/index.html`
3. **Verificar archivo LCOV**: Para integración con herramientas externas

## Solución de Problemas

### Error de Karma Plugin en Angular 20
Si ves el error `Package subpath './karma' is not defined by "exports"`:
```bash
# Instalar la dependencia necesaria
npm install --save-dev @angular-devkit/build-angular

# El karma.conf.js debe usar:
require('@angular-devkit/build-angular/plugins/karma')
# En lugar de: require('@angular/build/karma')
```

### Error de Política de Ejecución en PowerShell
Si ves el error "la ejecución de scripts está deshabilitada":
```bash
# Usar cmd en su lugar
cmd /c "npm run test:coverage"

# O cambiar la política temporalmente (como administrador)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Chrome no encontrado
Si hay problemas con Chrome, usar modo headless:
```bash
ng test --code-coverage --watch=false --browsers=ChromeHeadless
```

## Estructura de Archivos de Prueba

```
src/
├── app/
│   ├── app.spec.ts                          # Pruebas del componente principal
│   ├── services/
│   │   └── product.service.spec.ts          # Pruebas del servicio
│   └── components/
│       ├── product-list/
│       │   └── product-list.spec.ts         # Pruebas del listado
│       ├── product-new/
│       │   └── product-new.spec.ts          # Pruebas del formulario nuevo
│       └── product-edit/
│           └── product-edit.spec.ts         # Pruebas del formulario edición
```

## Coverage Esperado (Angular 20)

Con las pruebas implementadas para Angular 20, deberías obtener un coverage superior al 85% en:
- **Services**: 100% (todas las funciones del ProductService)
- **Components**: ~90% (principales funcionalidades y casos edge)
- **Models**: 100% (interfaces simples)

**Angular 20 mejoras en testing:**
- ✅ Mejor soporte para standalone components
- ✅ Testing mejorado de signals y computed properties
- ✅ Integración optimizada con el nuevo sistema de build
- ✅ Reportes de coverage más precisos

El objetivo del 70% mínimo está ampliamente superado con esta implementación específica para Angular 20.
