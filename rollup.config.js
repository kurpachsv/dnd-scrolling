import {uglify} from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'

const config = {
    input: 'src/index.js',
    external: ['react'],
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'dnd-scrolling',
        globals: {
            react: 'React',
        }
    },
    plugins: [
        babel({
            exclude: "node_modules/**"
        }),
        uglify()
    ],
};

export default config
