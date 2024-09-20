import React from 'react';
import logo from '../images/logo.png'
import phone from '../images/phone.png'
import email from '../images/email.png'
import mc from '../images/mc.png'
import visa from '../images/visa.png'

const GuestFooter = () => {
  return (
    
            <div className="footer">
                <div className="footer-div" id='firstcol'>
                    <img src={logo} alt="Logo" id='logo'/>
                    <p>SLT Event Ticket, Sri Lanka's premier and most trusted online ticket partner, serves as the official marketplace providing a secure and safe platform for purchasing tickets to all entertainment events in Sri Lanka.</p>
                    <div className="payment-icons">
                        <img src={mc} alt="MasterCard" id="payment-icon" />
                        <img src={visa} alt="Visa" id="payment-icon" />
                    </div>
                </div>
              
                <div className="footer-div">
                    <h4>Helpful Links</h4>

                    <div className="footer-div-items">
                        <a href='/guesthome'>
                            <p>Events</p>
                        </a>
                       
                        <a href='/guesthome'>
                            <p>Refund Policy</p>
                        </a>
                    </div>
                    
                </div>

                <div className="footer-div">
                    <h4>About Us</h4>
                    <div className="footer-div-items">
                        <a href='/guesthome'>
                            <p>Who we are</p>
                        </a>
                        <a href='/guesthome'>
                            <p>FAQ</p>
                        </a>
                        <a href='/guesthome'>
                            <p>Contact Us</p>
                        </a>
                    </div>
                    
                </div>
            
                <div className="footer-div">
                    <h4>Contact us</h4>
                    <div className="footer-div-items">

                        <p> <img src={phone} alt="" id='icon' /> +94 71 234 5678 </p>
                        <p> <img src={email} alt="" id='icon'/> slteventticket@gmail.com</p>
                   </div>
                </div>
            </div>    
  )
}

export default GuestFooter