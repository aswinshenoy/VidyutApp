import React, {useEffect, useState} from "react";
import CartItem from "../../components/purchase/cartItem";
import PaymentSummaryItem from "../../components/purchase/PaymentSummaryItem";
import dataFetch from "../../utils/dataFetch";
import '../../styles/purchase/cart.sass';
import {useRouter} from "next/router";
import Cookies from "universal-cookie";
import StatusContainer from "../../components/StatusContainer";
import Link from "next/link";
const _ = require('lodash');


const CartView = ({ productList, promocode, regID }) => {
    const router = useRouter();
    const cookies = new Cookies();

    const [products, setProducts] = useState(productList);
    const [isQueried, setQueried] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const [isPlacingOrder, setPlacingOrder] = useState(false);
    const [status, setStatus] = useState();
    const [vidyutID, setVidyutID] = useState();
    const [isAgreed, setAgreed] = useState(false);

    const vidQuery = `{
      myProfile
      {
        vidyutID
      }
      status
      {
         onlinePayment
         offlinePayment
         promocodes
         referrals
      } 
    }`;

    const getVIDQuery = async () => await dataFetch({ query: vidQuery });

    useEffect(() => {
        if(!isQueried) {
            getVIDQuery().then((response) => {
                setQueried(true);
                if (!Object.prototype.hasOwnProperty.call(response, 'errors')) {
                    setVidyutID(response.data.myProfile.vidyutID);
                    setStatus(response.data.status);
                    setLoaded(true);
                }
            })
        }
    });

    const promotions = isLoaded && status.promocodes ? (
        <div className="promocode-card mt-4 card-shadow">
            <h6>Apply Referral</h6>
            <div className="row m-0">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Enter Promocode</label>
                        <input className="form-control" value={promocode} disabled={!status.promocodes} />
                    </div>
                    { status.promocodes ? <button className="btn btn-primary">Apply</button> : null }
                </div>
            </div>
        </div>
    ) : null;

    const referrals = isLoaded && status.referral ? (
        <div className="referral-card mt-4 card-shadow">
            <h6>Apply Promotion</h6>
            <div className="row m-0">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Enter Referral Code [ VidyutID of Referrer ]</label>
                        <input className="form-control" disabled={!status.referral} />
                    </div>
                    <button className="btn btn-primary">Apply</button>
                </div>
            </div>
        </div>
    ) : null;

    const initiateOrderMutation = `mutation initiateOrder($products:ProductsInput!, $regID: String)
    {
      initiateOrder(products: $products, regID: $regID)
      {
        orderID
      }
    }`;

    const initiateTransactionMutation = `mutation initiateTransaction($orderID: String!, $isOnline: Boolean)
    {
      initiateTransaction(orderID: $orderID, isOnline: $isOnline)
      {
        transactionID
      }
    }`;

    const initiateOrder = async variables => await dataFetch({ query: initiateOrderMutation, variables });
    const initiateTransaction = async variables => await dataFetch({ query: initiateTransactionMutation, variables });

    const PayNow = (isOnline) => {
        const productsList = [];
        products.map( p => {
           productsList.push({
               "productID": p.productID,
               "qty": p.qty
           })
        });
        const variables = {
            "products": {
                "products": productsList
            },
            "regID": regID ? regID : null
        };
        setPlacingOrder(false);
        initiateOrder(variables).then((orderResp) => {
            const orderID = orderResp.data.initiateOrder.orderID;
            initiateTransaction({orderID, isOnline}).then(transResp => {
                const transactionID = transResp.data.initiateTransaction.transactionID;
                cookies.set('transactionID', transactionID, {path: '/'});
                if(isOnline)
                    router.push(`/pay/gateway`);
                else
                    router.push(`/pay/qr-pay?vidyutID=${vidyutID}`);
            });
        })
    };

    const calcTotalPrice = () => {
        let price = 0;
        products.map(p => price += p.price * p.qty);
        return parseInt(price);
    };

    const totalPrice = calcTotalPrice();


    const calcGST = (price) => {
        return price * 0.18;
    };

    const handleQtyChange = (pindex, qty) => {
        let newArr = [...products];
        newArr[pindex].qty = qty;
        setProducts(newArr);
    };

    const renderPaymentButtons = () => {
        const flag = productList.filter(p => p.isAvailable === false).length > 0 ? true : false;
        return !flag ? (<div>
            <p>Until you pay successfully for your transaction, your registration/purchase is not considered valid. You will receive an email on confirmation.</p>
            <p className="my-2">Pay at counter option is for accepting payments at Vidyut registration desk put up in your campus, and not for on-spot registrations.</p>
            { isLoaded && status.onlinePayment ? <button onClick={() => { PayNow(true); }} className="payment-button card-shadow">Pay Online</button> : null }
            { isLoaded && status.offlinePayment ?
                <button onClick={() => { PayNow(false); }} className="payment-button card-shadow">
                    Pay at Counter
                </button>
                : null
            }
        </div>) : <h6>Some items in your cart are unavailable right now. You cannot proceed with this order.</h6>
    };

    return isPlacingOrder ? <StatusContainer animation={require('../../images/animations/radar')} title="Loading" text="Please wait while we are placing your order" /> : (
        <div id="cart-view" className="card-shadow">
            <div className="row m-0">
                <div className="col-md-8">
                    <h4>In Your Cart</h4>
                    {
                        products.map((p,i) => (
                            <CartItem
                                photo={p.photo}
                                key={i}
                                isAvailable={p.isAvailable}
                                qty={p.qty}
                                onChangeQty={(qty) => handleQtyChange(i, qty)}
                                title={p.name}
                                text="No description available"
                                price={`Rs. ${parseInt(p.price)}`}
                                badge={
                                    p.isAmritapurianOnly ?
                                    <div className="badge badge-warning rounded-0">Exclusive for Amritapurians</div> :
                                    p.isFacultyOnly ?
                                    <div className="badge badge-warning rounded-0">Exclusive for Faculty/Industry Personnels</div> :
                                    p.isSchoolOnly ?
                                    <div className="badge badge-warning rounded-0">Exclusive for School Students</div> : null
                                }
                            />
                        ))
                    }
                    {promotions}
                    {referrals}
                </div>
                <div className="col">
                    <h4>Purchase Summary</h4>
                    <div>
                        <PaymentSummaryItem
                            cartValue={totalPrice}
                            charges={[
                                {
                                    'name': "GST @ 18%",
                                    'price': calcGST(totalPrice)
                                },
                                {
                                    'name': "Internet Handling Fee",
                                    'price': 0
                                },
                            ]}
                            deductions={[
                                // {
                                //     name : "Promocode - EARLYBIRD",
                                //     price: 0
                                // }
                            ]}
                        />
                        {
                            !isAgreed ? <div style={{fontSize: '1rem', lineHeight: '1.2'}}>
                                <input type="checkbox" className="pr-2 mr-2" onChange={(e) => setAgreed(true)} />
                                 By continuing with payment, I agree to the <Link href="/terms"><a>terms and conditions</a></Link>
                                and general <Link href="/coc"><a>code of conduct</a></Link> of Vidyut 2020.
                            </div> :
                            renderPaymentButtons()
                        }
                    </div>
                </div>
            </div>
        </div>
    )

};

export default CartView;