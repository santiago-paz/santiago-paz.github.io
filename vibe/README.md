# Mouse Chaser

Un juego de reflejos donde debes evitar que un ninja capture tu cursor mientras recoges orbes para sumar puntos.

## Cómo jugar

1. Abre el archivo `index.html` en tu navegador
2. Mueve el cursor rojo para evitar que el ninja (cuadrado de colores) te atrape
3. **Recoge los orbes dorados** que aparecen en pantalla para aumentar tu puntuación (tiempo sobrevivido + bonus por orbe)
4. El objetivo es sobrevivir la mayor cantidad de tiempo posible y obtener el mayor puntaje
5. ¡Cuidado! El ninja es extremadamente agresivo, usará los orbes como cebo y adaptará sus estrategias según tu habilidad

## Características

### Orbes Coleccionables

- Aparecen secuencialmente siguiendo un patrón en espiral
- Recoger un orbe otorga un bonus de tiempo a tu puntuación
- El ninja sabe dónde aparecerá el próximo orbe y lo usa en su estrategia

### El Ninja

El ninja tiene diferentes estrategias para intentar atrapar tu cursor:

- **Negro (Estrategia Directa)**: Sigue directamente tu cursor, con ligera atracción hacia el orbe
- **Púrpura (Predicción)**: Analiza tu velocidad y aceleración para predecir tus movimientos, considerando tu posible trayectoria hacia el orbe
- **Azul (Zigzag)**: Se mueve en patrones impredecibles alrededor tuyo o del orbe
- **Verde (Emboscada)**: Calcula puntos estratégicos para emboscarte, a veces cerca del próximo orbe
- **Rojo (Intercepción)**: Calcula el punto óptimo para interceptar tu trayectoria, a veces apuntando al orbe
- **Naranja (Guardia - ¡Nueva!)**: Intenta posicionarse entre tú y el orbe activo para bloquearte el paso

### Comportamiento Adaptativo

El ninja no solo sigue estrategias predefinidas, sino que:

- Analiza tu habilidad para evadir y se adapta en tiempo real
- Usa la posición del orbe para tenderte trampas o bloquearte
- Es más agresivo cuando estás lejos para evitar que puedas mantener la distancia
- Calcula puntos de parada cuando detecta que estás frenando
- Cambia más rápido de estrategia si demuestras habilidad para evadirlo
- Ajusta su velocidad según la distancia y tiempo de juego

### Movimientos del Ninja

El ninja alterna entre diferentes fases:

1. **Acecho/Guardia**: Movimiento estratégico mientras analiza tu posición y la del orbe
2. **Dash**: Movimiento rápido para intentar atraparte, a veces apuntando al orbe
3. **Descanso**: Breve pausa después de un dash (más corta para dificultad alta)

### Dificultad progresiva

- La velocidad del ninja aumenta cada 5 segundos
- La agresividad aumenta según tu habilidad para evadir
- El ninja cambia de estrategia basándose en tus patrones de movimiento

## Controles

- Simplemente mueve el mouse para controlar el cursor rojo
- Si el ninja te atrapa, haz clic para reiniciar el juego
- Utiliza cambios rápidos de dirección para confundir al ninja

## Consejos para sobrevivir

- No vayas directamente a por el orbe si el ninja está cerca o en modo guardia
- Fíjate en el color/forma del ninja para anticipar si usará el orbe como trampa
- Realiza movimientos impredecibles y cambia de dirección constantemente
- No te quedes quieto, el ninja está diseñado para predecir puntos de parada
- Evita movimientos muy repetitivos, ya que el ninja aprende de tus patrones
- Mantén una distancia prudente; estar demasiado lejos aumenta su agresividad
- Observa el color del ninja para anticipar su estrategia actual

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)

## Cómo modificar el juego

Si quieres ajustar la dificultad, puedes modificar las siguientes variables en `script.js`:

- `dashSpeed`: Velocidad del ataque rápido
- `stalkingSpeed`: Velocidad del movimiento lento
- Los tiempos de dash y descanso

## Créditos

Creado como un proyecto de programación inspirado en juegos de reflejos clásicos.