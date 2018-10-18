# IPO-Pong
JS/HTML5 Pong clone using IPO (Input->Processing->Output) methodology as well as graphics optimization techniques

Credits for the game engine concept and Vector class are found within those files, including modifications

All graphics variations are prerendered to offscreen canvases to create sprite sheets which can then be blitted quickly to the primary buffer canvas.

Particle effects are handled using a dynamic object pooling system allowing the pool of objects to be reused and avoiding cycles being taken up from unnecessary garbage collector calls.

Audio is handled by utilizing the Web Audio API which allows for several interesting effects, including pitch variation of the sound samples to make the sounds slightly more interesting to the ear, as well as a stereo panning effect which causes the sounds to be played where they happen, whether on the left or right side of the playfield.