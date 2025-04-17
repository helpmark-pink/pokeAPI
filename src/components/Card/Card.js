import React from 'react'
import './Card.css'
import { Card as BootstrapCard } from 'react-bootstrap'

const Card = ({ pokemon }) => {
  return (
    <BootstrapCard className='card'>
      <BootstrapCard.Img variant="top" src={pokemon.sprites.front_default} alt={pokemon.name} />
      <BootstrapCard.Body>
        <BootstrapCard.Title className='card__name'>{pokemon.name}</BootstrapCard.Title>
        <div className='card__type'>
          <div>タイプ</div>
          {pokemon.types.map((type, index) => {
            return (
              <div key={index}>
                <span className='typeName'>{type.type.name}</span>
              </div>
            )
          })}
          <div className='cardInfo'>
            <div className='cardDate'>
              <p className='title'>重さ：{pokemon.weight}</p>
            </div>
            <div className='cardDate'>
              <p className='title'>高さ：{pokemon.height}</p>
            </div>
            <div className='cardDate'>
              <p className='title'>アビリティ：{pokemon.abilities[0].ability.name}</p>
            </div>
          </div>
        </div>
      </BootstrapCard.Body>
    </BootstrapCard>
  )
}

export default Card