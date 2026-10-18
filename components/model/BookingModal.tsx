import { db } from '@/app/firebase/firebase.config';
import { UserContext } from '@/context/guest/UserContext';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ChevronLeftIcon, X } from 'lucide-react-native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import { Calendar } from 'react-native-calendars';

type Props = {
  visible: boolean;
  onClose: () => void;
  property: any
};

export default function BookingModal({ visible, onClose, property }: Props) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { profile } = useContext(UserContext);

  const router = useRouter();

  // Guests state
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [guestNames, setGuestNames] = useState<string[]>([]);

  // Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  // Resize guestNames array when adults count changes
  useEffect(() => {
    setGuestNames((prev) => {
      const targetSize = Math.max(0, adults - 1);
      const newNames = [...prev];
      if (targetSize > prev.length) {
        // Add empty strings for new adults
        for (let i = prev.length; i < targetSize; i++) {
          newNames.push('');
        }
      } else if (targetSize < prev.length) {
        // Remove excess names
        newNames.length = targetSize;
      }
      return newNames;
    });
  }, [adults]);

  const updateGuestName = (index: number, text: string) => {
    setGuestNames((prev) => {
      const copy = [...prev];
      copy[index] = text;
      return copy;
    });
  };

  // calendar month state (artificial calendar)
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() }; // month 0-11
  });

  const onDayPress = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    if (date < today) return; // don't allow past selection
    if (!startDate || endDate) {
      setStartDate(dateString);
      setEndDate(null);
    } else if (dateString > startDate) {
      setEndDate(dateString);
    } else {
      setStartDate(dateString);
      setEndDate(null);
    }
  };

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const clearGuests = () => {
    setAdults(1);
    setChildren(0);
  };

  // compute marked dates for calendar (period)
  const markedDates = useMemo(() => {
    if (!startDate) return {};
    if (!endDate) {
      return {
        [startDate]: { selected: true, color: '#2563EB' },
      };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const marks: Record<string, any> = {};

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (dateStr === startDate) {
        marks[dateStr] = { startingDay: true, color: '#2563EB' };
      } else if (dateStr === endDate) {
        marks[dateStr] = { endingDay: true, color: '#2563EB' };
      } else {
        marks[dateStr] = { color: '#BEE1FF' };
      }
    }

    return marks;
  }, [startDate, endDate]);

  // nights used for price display
  const nights = useMemo(() => {
    if (!startDate) return 0;
    if (!endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return diff || 1;
  }, [startDate, endDate]);

  const initiateBooking = () => {
    if (!startDate || !endDate) return;
    if (guestNames.some((name) => name.trim() === '')) {
      alert("Please enter names for all guests");
      return;
    }
    setShowPaymentModal(true);
  };

  const finalizeBooking = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        propertyId: property.id,
        propertyTitle: property.title || "Unknown Property",
        propertyImage: property.photos?.[0] || "",
        userId: profile?.uid || "guest",
        userName: profile?.name || "Guest User",
        userEmail: profile?.email || "",
        guestImage: profile?.profile_image_url || "",
        guestName: profile?.name || "Guest User",
        dates: {
          start: startDate,
          end: endDate,
        },
        guests: {
          adults,
          children,
        },
        guestNames,
        paymentMethod: paymentMethod,
        totalPrice: nights * property.price * adults,
        status: property.bookingReq === 'instant_book' ? "booked" : "pending",
        propertyLocation: property.address.flat + ", " + property.address.city + ", " + property.address.state + ", " + property.address.pincode,
        adminNote: "",
        createdAt: serverTimestamp(),
      };
      console.log(bookingData)

      await addDoc(collection(db, "bookings"), bookingData)
        .then((docRef) => {
          console.log("Document successfully written!", docRef.id);
          setShowPaymentModal(false);
          setLoading(false);
          onClose();
          router.push(`/detail/confirm/${docRef.id}`)
        })
        .catch((error) => {
          console.error("Error writing document!", error);
          setLoading(false);
        });

    } catch (error) {
      console.error("Error creating booking:", error);
      setLoading(false);
      alert("Failed to create booking. Please try again.");
    }
  };

  // artificial calendar helpers
  const monthName = (y: number, m: number) =>
    new Date(y, m).toLocaleString(undefined, { month: 'long', year: 'numeric' });

  const generateMonthMatrix = (year: number, month: number) => {
    // returns array of weeks, each week is array of Date | null (7 items)
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);
    const firstWeekday = firstOfMonth.getDay(); // 0 Sun - 6 Sat
    const daysInMonth = lastOfMonth.getDate();

    const weeks: (Date | null)[][] = [];
    let week: (Date | null)[] = new Array(7).fill(null);
    let day = 1;

    // fill first week
    for (let i = firstWeekday; i < 7; i++) {
      week[i] = new Date(year, month, day++);
    }
    weeks.push(week);

    while (day <= daysInMonth) {
      week = new Array(7).fill(null);
      for (let i = 0; i < 7 && day <= daysInMonth; i++) {
        week[i] = new Date(year, month, day++);
      }
      weeks.push(week);
    }

    return weeks;
  };

  const monthMatrix = useMemo(
    () => generateMonthMatrix(visibleMonth.year, visibleMonth.month),
    [visibleMonth]
  );

  const isBetween = (dStr: string, s: string | null, e: string | null) => {
    if (!s || !e) return false;
    return dStr > s && dStr < e;
  };

  const goPrev = () => {
    setVisibleMonth((cur) => {
      const m = cur.month - 1;
      if (m < 0) return { year: cur.year - 1, month: 11 };
      return { year: cur.year, month: m };
    });
  };

  const goNext = () => {
    setVisibleMonth((cur) => {
      const m = cur.month + 1;
      if (m > 11) return { year: cur.year + 1, month: 0 };
      return { year: cur.year, month: m };
    });
  };

  const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <X size={20} />
          </TouchableOpacity>

          {!showPaymentModal ? (
            <ScrollView showsVerticalScrollIndicator={false}>

              <View style={styles.headerRow}>
                <Text style={styles.title}>Dates</Text>
                <TouchableOpacity onPress={clearDates}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>

              {/* Artificial Calendar */}
              <View style={styles.calendarCard}>
                <View style={styles.calendarHeader}>
                  <TouchableOpacity onPress={goPrev} style={styles.navBtn}>
                    <Text style={styles.navTxt}>‹</Text>
                  </TouchableOpacity>
                  <Text style={styles.calendarTitle}>
                    {monthName(visibleMonth.year, visibleMonth.month)}
                  </Text>
                  <TouchableOpacity onPress={goNext} style={styles.navBtn}>
                    <Text style={styles.navTxt}>›</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.weekRow}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <Text key={d} style={styles.weekDay}>
                      {d}
                    </Text>
                  ))}
                </View>

                {monthMatrix.map((week, wi) => (
                  <View key={wi} style={styles.weekRow}>
                    {week.map((dt, di) => {
                      if (!dt) return <View key={di} style={styles.dayCell} />;
                      const dateStr = dt.toISOString().split('T')[0];
                      const disabled = dt < today;
                      const isStart = dateStr === startDate;
                      const isEnd = dateStr === endDate;
                      const inRange = isBetween(dateStr, startDate, endDate);
                      return (
                        <TouchableOpacity
                          key={di}
                          style={[
                            styles.dayCell,
                            disabled && styles.dayDisabled,
                            inRange && styles.dayInRange,
                            isStart && styles.dayStart,
                            isEnd && styles.dayEnd,
                          ]}
                          onPress={() => onDayPress(dt)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              disabled && styles.dayTextDisabled,
                              (isStart || isEnd) && styles.dayTextSelected,
                            ]}
                          >
                            {dt.getDate()}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>

              <View style={styles.headerRow}>
                {/* <Text style={[styles.title, { marginTop: 12 }]}>Guests</Text>
             <TouchableOpacity onPress={clearGuests}>
               <Text style={styles.clearText}>Clear</Text>
             </TouchableOpacity> */}
              </View>

              <View style={styles.guests}>
                <View style={styles.guestRow}>
                  <View>
                    <Text style={styles.guestLabel}>Adults</Text>
                    <Text style={styles.guestSub}>Age 13+</Text>
                  </View>
                  <View style={styles.counter}>
                    <TouchableOpacity
                      style={styles.counterBtn}
                      onPress={() => setAdults(Math.max(1, adults - 1))}
                    >
                      <Text style={styles.counterText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{adults}</Text>
                    <TouchableOpacity
                      style={styles.counterBtn}
                      onPress={() => setAdults(adults + 1)}
                    >
                      <Text style={styles.counterText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Guest Names Inputs */}
                {
                  guestNames.length > 0 &&
                  (
                    <>
                      {guestNames.map((name, index) => (
                        <View key={index} style={{ marginTop: 10 }}>
                          <Text style={styles.inputLabel}>Guest {index + 2} Name</Text>
                          <TextInput
                            style={styles.input}
                            placeholder={`Full name of Guest ${index + 2}`}
                            value={name}
                            onChangeText={(text) => updateGuestName(index, text)}
                          />
                        </View>
                      ))}
                    </>
                  )
                }

                <View style={[styles.guestRow, { marginTop: 12 }]}>
                  <View>
                    <Text style={styles.guestLabel}>Children</Text>
                    <Text style={styles.guestSub}>Ages 2-12</Text>
                  </View>
                  <View style={styles.counter}>
                    <TouchableOpacity
                      style={styles.counterBtn}
                      onPress={() => setChildren(Math.max(0, children - 1))}
                    >
                      <Text style={styles.counterText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{children}</Text>
                    <TouchableOpacity
                      style={styles.counterBtn}
                      onPress={() => setChildren(children + 1)}
                    >
                      <Text style={styles.counterText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

            </ScrollView>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20, marginTop: 10 }}>
                <TouchableOpacity onPress={() => setShowPaymentModal(false)} >
                  <ChevronLeftIcon size={25} />
                </TouchableOpacity>
                <Text style={styles.title}>Select Payment Method</Text>
              </View>
              <View style={{ marginTop: 20 }}>
                {PAYMENT_METHODS.map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.paymentOption,
                      paymentMethod === method && styles.paymentOptionSelected
                    ]}
                    onPress={() => setPaymentMethod(method)}
                  >
                    <View style={[
                      styles.radioCircle,
                      paymentMethod === method && styles.radioCircleSelected
                    ]} />
                    <Text style={styles.paymentText}>{method}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <View>
              <Text style={styles.price}>
                ${nights * property.price * adults}
              </Text>
              <Text style={styles.nights}>{nights} night{nights > 1 ? 's' : ''}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.reserve,
                !showPaymentModal && (!startDate || !endDate) && { opacity: 0.5 },
                showPaymentModal && !paymentMethod && { opacity: 0.5 }
              ]}
              disabled={loading || (!showPaymentModal ? (!startDate || !endDate) : !paymentMethod)}
              onPress={showPaymentModal ? finalizeBooking : initiateBooking}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.reserveText}>
                  {showPaymentModal ? "Pay & Book" : "Confirm Booking"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 16,
    maxHeight: '90%',
    minHeight: 500
  },
  close: {
    alignSelf: 'center',
    marginBottom: 10,
    position: 'absolute',
    top: "-10%",
    height: 45,
    width: 45,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  clearText: {
    color: '#2563EB',
    fontWeight: '600',
  },

  /* Calendar styles */
  calendarCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6EEF9',
    padding: 12,
    backgroundColor: '#fff',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
  navBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  navTxt: {
    fontSize: 20,
    color: '#2563EB',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  weekDay: {
    width: 36,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 12,
  },
  dayCell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    color: '#111827',
  },
  dayDisabled: {
    opacity: 0.3,
  },
  dayTextDisabled: {
    color: '#9CA3AF',
  },
  dayInRange: {
    backgroundColor: '#BEE1FF',
    borderRadius: 6,
  },
  dayStart: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
  },
  dayEnd: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },

  guests: {
    marginTop: 8,
    paddingVertical: 8,
  },
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    borderColor: '#E5E7EB'
  },
  guestLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  guestSub: {
    color: '#6B7280',
    fontSize: 12,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  counterText: {
    fontSize: 18,
    fontWeight: '600',
  },
  counterValue: {
    minWidth: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  reserve: {
    backgroundColor: '#ff4757',
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  reserveText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // elevated look
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  price: {
    fontWeight: '700',
    fontSize: 18,
  },
  nights: {
    fontWeight: '500',
    color: '#6B7280',
    fontSize: 13,
  },
  subPrice: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  backText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  paymentOptionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: '#2563EB',
    borderWidth: 6,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
});
