import data from './data.json'
import { Link } from 'react-router-dom'
import details from './details'
const MainPage = () => {
    return (
        <div>
            <div>
                {data.map((campgain) => (
                    <div key={campgain.id}>
                            <Link to={`/details/${campgain.id}`}>
                            <h1>{campgain.description}</h1>
                            </Link>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default MainPage;
