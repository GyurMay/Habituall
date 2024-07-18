const initData = {
      userId,
      habits: [
        {
            "habitId": 100,
            "makeHabit": "100m x 10 dash",
            "breakHabit": "No high calorie intake",
            "dueDate":{
              "year": 2023,
              "month": 12,
              "day": 6
            },
            "daysRemaining": 5, //remove this
            "notes":[
              // {
              //   "date": "Nov 23 2023",
              //   "note":"fell asleep",
              //   "done": false
              // },
              // {
              //   "date": "Nov 24 2023",
              //   "note":"fell asleep again",
              //   "done": true
              // },
              // {
              //   "date": "Nov 29 2023",
              //   "note":"some shit",
              //   "done": false
              // }
            ]
        },
        {
            "habitId": 101,
            "makeHabit": "Curl ups",
            "breakHabit": "",
            "daysRemaining": 12,
            "notes":[
              {
                "date": "Nov 13 2023",
                "note":"fell asleep",
                "done": false,
                "comments": [
                  {
                    "uid": "6552b8c5431645bb42ba229d",
                    "comment": "fell asleep lmaoo"
                  }
                ]
              },
              {
                "date": "Nov 14 2023",
                "note":"fell asleep again",
                "done": true,
                "comments": [
                  {
                    "uid": "6552b8c5431645bb42ba229d",
                    "comment": "again??"
                  }
                ]
              },
              {
                "date": "Nov 17 2023",
                "note":"",
                "done": undefined,
                "comments": [
                  {
                    "uid": "6552b8c5431645bb42ba229d",
                    "comment": "fell asleep lmaoo"
                  }
                ]
              }
              // {
              //   "date": "Dec 01 2023",
              //   "note":"get shit done",
              //   "done": true
              // }
            ]
        },
        {
            "habitId": 102,
            "makeHabit": "Pull ups",
            "breakHabit": "",

            "daysRemaining": 14,
            "notes":[
              {
                "date": "Nov 23 2023",
                "note":"fell asleep",
                "done": false,
                "comments": [
                  
                ]
              },
              {
                "date": "Nov 25 2023",
                "note":"fell asleep again",
                "done": true,
                "comments": [
                  {
                    "uid": "6552b8c5431645bb42ba229d",
                    "comment": "fell asleep lmaoo"
                  }
                ]
              }],
            },
        {
          habitId: 103,
          makeHabit: "this user " +req.session.passport.user,
          breakHabit: 'n/a',
          progress: 50,
          daysRemaining: 5,
          streak: 0,
          days: 6
        }
      ]
    }
    module.exports=initData;