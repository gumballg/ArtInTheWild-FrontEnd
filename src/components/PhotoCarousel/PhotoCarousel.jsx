import { useEffect, useState, useContext } from 'react';
import { Carousel, Spinner } from 'react-bootstrap';
import { getMuralsWithPhoto } from '../../utils/murals-api';
import Logo from '../../assets/artInTheWild.jpg'
import { MuralDispatchContext } from '../../utils/contexts';
import { useNavigate } from 'react-router-dom';

function PhotoCarousel() {
  const [murals, setMurals] = useState(null)
  const [imgLoading, setImgLoading] = useState(true)
  const dispatch = useContext(MuralDispatchContext)
  
	const navigate = useNavigate()
  
  useEffect(() => {
    getMurals()
  }, [])

	const handleClick = (mural) => {
    if(!mural._id) return
		dispatch({
      type: 'changed',
      mural: {...mural, updatedBy:'home'}
    })
		navigate(`/mural/home/${mural._id}`)
	}

  const getMurals = async () => {
    const muralsResponse = await getMuralsWithPhoto()
    const muralsWithLogo = [...muralsResponse.murals]
    muralsWithLogo.unshift({photos:[{photo:Logo}]})
    setMurals(muralsWithLogo)
  }

  return (
    <Carousel>
      {murals && murals.map((mural, i) => (
      <Carousel.Item key={i} onClick={() => handleClick(mural)}>
        <img 
          src={mural.photos[0].photo}
          onLoad={() => setImgLoading(false)} 
          style={{ display: imgLoading ? 'none' : 'block'}}
        />
        {imgLoading && <Spinner style={{ display: 'block', margin: 'auto'}} />}
        <Carousel.Caption>
          <h3>{mural.title}</h3>
          <p>{mural.artist}</p>
        </Carousel.Caption>
      </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default PhotoCarousel;