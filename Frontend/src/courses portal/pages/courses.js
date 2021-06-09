const courses = [
    { 
        id:"1",
        name:"Arduino",
        topics:[
            { 
                id:"1",
                name:"Introducation",
                subtopics:[
                    { 
                        subTopicId:"1",
                        subTopicName:"Introducation to robotics",
                        time:"30"
                    },
                    { 
                        subTopicId:"2",
                        subTopicName:"Introducation to arduino",
                        time:"40"
                    },
                    {
                        subTopicId:"3",
                        subTopicName:"MicroProcessors & Microcontrollers",
                        time:"40"
                    }
                ]
            },
            { 
                id:"2",
                name:"Ultrasoni-Sensor",
                subtopics:[
                    { 
                        subTopicId:"1",
                        subTopicName:"Introducation to ultrasonic-sensor",
                        time:"40"
                    },
                    { 
                        subTopicId:"2",
                        subTopicName:"Coding of ultrasonic sensor",
                        time:"30"
                    },
                    {
                        subTopicId:"3",
                        subTopicName:"Task of ultrasonic",
                        time:"50"
                    }
                ]
            },
            { 
                id:"3",
                name:"LCD screen",
                subtopics:[
                    { 
                        subTopicId:"1",
                        subTopicName:"Introducation to LCD",
                        time:"40"
                    },
                    { 
                        subTopicId:"2",
                        subTopicName:"Coding of LCD",
                        time:"30"
                    },
                    {
                        subTopicId:"3",
                        subTopicName:"Task of LCD",
                        time:"50"
                    }
                ]
            }
        ],
        rating:"4.7",
        description:[
            "In this course you will learn about arduino",
            "In this course you will learn about arduino",
            "In this course you will learn about arduino",
            "In this course you will learn about arduino"
        ],
        totalTime:"40",
        price:"1000"
    },
    { 
        id:"2",
        name:"ROS",
        topics:[
            { 
                id:"1",
                name:"Introducation",
                subtopics:[
                    { 
                        subTopicId:"1",
                        subTopicName:"Introducation to ROS",
                        time:"30"
                    },
                    { 
                        subTopicId:"2",
                        subTopicName:"Introducation to ROS-Manupulation",
                        time:"40"
                    }
                ]
            },
            { 
                id:"2",
                name:"LCD screen",
                subtopics:[
                    { 
                        subTopicId:"1",
                        subTopicName:"Introducation to LCD",
                        time:"40"
                    },
                    { 
                        subTopicId:"2",
                        subTopicName:"Coding of LCD",
                        time:"30"
                    },
                    {
                        subTopicId:"3",
                        subTopicName:"Task of LCD",
                        time:"50"
                    }
                ]
            }
        ],
        rating:"4.4",
        description:[
            "In this course you will learn about ROS",
            "In this course you will learn about ROS",
            "In this course you will learn about ROS",
            "In this course you will learn about ROS"
        ],
        totalTime:"50",
        price:"1000"
    },
    { 
        id:"3",
        name:"AR-VR",
        topics:[
            { 
                id:"1",
                name:"Introducation",
                subtopics:[
                    { 
                        subTopicId:"1",
                        subTopicName:"Introducation to AV",
                        time:"30"
                    },
                    { 
                        subTopicId:"2",
                        subTopicName:"Introducation to VR",
                        time:"40"
                    }
                ]
            },
            { 
                id:"2",
                name:"LCD screen",
                subtopics:[
                    { 
                        subTopicId:"1",
                        subTopicName:"Introducation to LCD",
                        time:"40"
                    },
                    { 
                        subTopicId:"2",
                        subTopicName:"Coding of LCD",
                        time:"30"
                    },
                    {
                        subTopicId:"3",
                        subTopicName:"Task of LCD",
                        time:"50"
                    }
                ]
            }
        ],
        rating:"4.6",
        description:[
            "In this course you will learn about AR-VR",
            "In this course you will learn about AR-VR",
            "In this course you will learn about AR-VR",
            "In this course you will learn about AR-VR"
        ],
        totalTime:"40",
        price:"1000"
    }
]

export default courses;