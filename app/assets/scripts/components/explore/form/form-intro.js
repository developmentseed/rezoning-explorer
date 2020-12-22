import React, { useState, useEffect } from 'react';
import T from 'prop-types';
import { FormHeader } from '../../../styles/form/form';
import Heading from '../../../styles/type/heading';

const FormIntro = (props, { startOpen }) => {
  const { formTitle, introText } = props;
  const [open, toggleOpen] = useState(startOpen);
  const [isMounted, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <FormHeader>
      <details onToggle={() => isMounted && toggleOpen(!open)} open={open}>
        <summary>
          <Heading size='small'>
            {formTitle}
          </Heading>
          <span>Read {open ? 'less' : 'more'}</span>
        </summary>
        <p>{introText}</p>
      </details>
    </FormHeader>
  );
};

FormIntro.propTypes = {
  formTitle: T.string,
  introText: T.string
};

export default FormIntro;
