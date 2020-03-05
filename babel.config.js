// Babel configuration.
const presets = Object.entries({
    '@babel/preset-env': { targets: { node: 'current' } },
    '@babel/preset-typescript': {}
});

const plugins = Object.entries({
    // ECMAScript proposals.
    '@babel/plugin-proposal-decorators': { decoratorsBeforeExport: true },
    '@babel/plugin-proposal-class-properties': {},

    // Runtime engine.
    '@babel/plugin-transform-runtime': { regenerator: false }
});

module.exports = { presets, plugins };
