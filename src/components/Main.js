import React, { useRef, useState } from 'react';
import '../styles/Main.scss';
import Button from '@material-ui/core/Button';
import Cropper from './Cropper';
import AddText from './AddText/AddText';
import AddTextContent from './AddText/AddTextContent';

const Main = props => {
  const canvasRef = useRef(null);
  const [canvasScale, setCanvasScale] = useState({});

  const openImage = evt => {
    const canvasEl = canvasRef.current;
    const context = canvasEl.getContext(`2d`);
    const img = evt.target.files[0];
    const reader = new FileReader();

    reader.onload = readerEvt => {
      const image = new Image();

      image.src = readerEvt.target.result;
      image.onload = () => {
        const maxWidth = 800;
        let { width } = image;
        let { height } = image;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else if (height > maxWidth) {
          width *= maxWidth / height;
          height = maxWidth;
        }
        canvasEl.width = width;
        canvasEl.height = height;
        context.drawImage(image, 0, 0, width, height);

        if (canvasRef.current) {
          const { offsetLeft, offsetTop } = canvasRef.current;
          setCanvasScale({
            left: offsetLeft,
            top: offsetTop,
            width,
            height,
          });
        }
      };
    };
    if (img) {
      reader.readAsDataURL(img);
    }
  };

  const [cropIsActive, setCropIsActive] = useState(false);
  const startCrop = e => {
    e.preventDefault();
    setCropIsActive(!cropIsActive);
  };

  const [addTextActive, setAddTextActive] = useState(false);
  const [focusedTextID, setFocusedTextID] = useState('');
  const [textContents, setTextContents] = useState([]);

  const addTextContent = () => {
    const { width, height, top, left } = canvasScale;
    const id = `text_${new Date().getDate()}`;
    const adjustedTop = top + height / 2;
    const adjustedLeft = left + width / 2;
    const text = `TEXT`;
    const font = `Arial`;
    const newContent = { id, width, height, top: adjustedTop, left: adjustedLeft, text, font };
    setFocusedTextID(id);
    setTextContents([...textContents, newContent]);
  };

  return (
    <section>
      <aside>
        <Button className="open-btn" variant="contained" color="primary">
          OPEN IMAGE
          <input
            className="open-file"
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={openImage}
          />
        </Button>
        {canvasRef.current && (
          <Button className="open-btn" variant="contained" color="primary" onClick={startCrop}>
            Crop
          </Button>
        )}
        {canvasRef.current && (
          <Button
            className="add-text-btn open-btn"
            variant="contained"
            color="primary"
            onClick={setAddTextActive}
          >
            TEXT ADD
          </Button>
        )}
      </aside>
      <article className="editor-container horizontal">
        <canvas className="editor" ref={canvasRef}></canvas>
        {cropIsActive && <Cropper canvasScale={canvasScale} addTextContent={addTextContent} />}
        {textContents.length > 0 &&
          textContents.map(item => <AddTextContent key={item.id} contentAttribute={item} />)}
      </article>
      <nav>
        {addTextActive && <AddText addTextContent={addTextContent} focusedTextID={focusedTextID} />}
      </nav>
    </section>
  );
};

export default Main;
