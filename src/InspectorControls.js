/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n';
import {addFilter, applyFilters} from '@wordpress/hooks';
import {InspectorControls} from '@wordpress/block-editor';
import {
    Button,
    PanelRow,
    __experimentalGrid as Grid, // eslint-disable-line
} from '@wordpress/components';

/**
 * All available icons.
 * (Order determines ptygjhyresentation order)
 */


/**
 * Add the attributes needed for button icons.
 *
 * @since 0.1.0
 * @param {Object} settings
 */
function addAttributes(settings) {
    if ('core/button' !== settings.name) {
        return settings;
    }

    // Add the block visibility attributes.
    const iconAttributes = {
        icon: {
            type: 'string',
        }
    };

    const newSettings = {
        ...settings,
        attributes: {
            ...settings.attributes,
            ...iconAttributes,
        },
    };

    return newSettings;
}

addFilter(
    'blocks.registerBlockType',
    'mosne-button-icons/add-attributes',
    addAttributes
);

/**
 * Filter the BlockEdit object and add icon inspector controls to button blocks.
 *
 * @since 0.1.0
 * @param {Object} BlockEdit
 */
function addInspectorControls(BlockEdit) {
    return (props) => {
        if (props.name !== 'core/button') {
            return <BlockEdit {...props} />;
        }

        const {attributes, setAttributes} = props;
        const {icon: currentIcon} = attributes;
        // Get the icons from the filter and set a default
        // icon can be filtered by block name
        const ICONS = applyFilters(
            'mosne-button-icons.icons',
            [
                {
                    label: __('Arrow Right', 'mosne-button-icons'),
                    value: 'arrow-right',
                },
                {
                    label: __('Arrow Left', 'mosne-button-icons'),
                    value: 'arrow-left',
                },
                {
                    label: __('Download', 'mosne-button-icons'),
                    value: 'download',
                },
                {
                    label: __('External', 'mosne-button-icons'),
                    value: 'external',
                },
            ],
            props.name
        );
        return (
            <>
                <BlockEdit {...props} />
                <InspectorControls group="color">
                    <div className="button-icon-picker">
                        <Grid
                            className="block-editor-block-styles__variants"
                            columns="2"
                            gap="4"
                        >
                            {ICONS.map((icon, index) => (
                                <Button
                                    key={index}
                                    label={icon?.label}
                                    isPressed={currentIcon === icon.value}
                                    className="components-button is-secondary block-editor-block-styles__item-text"
                                    onClick={() =>
                                        setAttributes({
                                            // Allow user to disable icons.
                                            icon:
                                                currentIcon === icon.value
                                                    ? null
                                                    : icon.value,
                                        })
                                    }
                                >
                                    <span className="components-truncate">
                                        {icon.label}
                                    </span>
                                </Button>
                            ))}
                        </Grid>
                    </div>
                </InspectorControls>
            </>
        );
    };
}

addFilter(
    'editor.BlockEdit',
    'mosne-button-icons/add-inspector-controls',
    addInspectorControls
);

/**
 * Add icon and position classes in the Editor.
 *
 * @since 0.1.0
 * @param {Object} BlockListBlock
 */
function addClasses(BlockListBlock) {
    return (props) => {
        const {name, attributes} = props;

        if ('core/button' !== name || !attributes?.icon) {
            return <BlockListBlock {...props} />;
        }

        const classes = classnames(props?.className, {
            [`has-icon has-icon__${attributes?.icon}`]: attributes?.icon,
        });

        return <BlockListBlock {...props} className={classes}/>;
    };
}

addFilter(
    'editor.BlockListBlock',
    'mosne-button-icons/add-classes',
    addClasses
);

function addClassesSave(props, blockType, attributes) {
    if ('core/button' !== blockType.name) {
        return props;
    }

    props.className = classnames(props.className, {
        [`has-icon__${attributes?.icon}`]: attributes?.icon,
    });

    return props;
}

addFilter(
    'blocks.getSaveContent.extraProps',
    'mosne-button-icons/add-classes-save',
    addClassesSave
);
