import '../css/categoriescard.css'


const CategoriesCard = ({Img,Title}) => {

    return(
        <div className='categories-card'>
        <img src={Img} className='categories-card-img'></img>
        <div className='categories-card-title'>{Title}</div>
        
        </div>

        

    )
}

export default CategoriesCard;