import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { registerFormatType, toggleFormat, insert, insertObject } from '@wordpress/rich-text';
import {registerBlockVariation} from '@wordpress/blocks';
import { listItem } from '@wordpress/icons';

const { __ } = wp.i18n;
const name = 'mosne/button-icon-inline';
const title = __( 'Inline icon' );

const ButtonIconsEdit = ( { isActive, onChange, onFocus, value } ) => {


    const selectedBlock = useSelect( ( select ) => {
        return select( 'core/block-editor' ).getSelectedBlock();
    }, [] );

    // allow only in button blocks
    if ( selectedBlock && selectedBlock.name !== 'core/button' ) {
        return null;
    }

    return (
        <>
            <RichTextToolbarButton
                  icon={ listItem }
                  title={ title}
                  onClick={ () => {
                      onChange(
                          toggleFormat( value, {
                              type: name,
                          } ),
                          onFocus()
                      );
                  } }
                  isActive={ isActive }
                  role="menuitemcheckbox"
              />
        </>
    );
};

registerFormatType( name, {
    title: title,
    name: name,
    tagName: 'span',
    className: 'wp-block-button__icon',
    ariaHidden: true,
    edit: ButtonIconsEdit,
} );


registerBlockVariation('core/button', {
  name: 'button-icon-right',
  title: 'Icon right',
  attributes: {
    text: 'Button <span class="wp-block-button__icon" aria-hidde="true">+</span>',
    url: '',
  },
});

registerBlockVariation('core/button', {
  name: 'button-icon-left',
  title: 'Icon left',
  attributes: {
    text: '<span class="wp-block-button__icon" aria-hidde="true">+</span> Button',
    url: '',
  },
});